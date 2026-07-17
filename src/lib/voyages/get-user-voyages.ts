import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { UserVoyage } from "@/lib/voyages/types";

const enrollmentRank: Record<string, number> = {
  active: 0,
  invited: 1,
  completed: 2,
  inactive: 3,
  withdrawn: 4,
};

function unwrapRelation<T>(value: T | T[] | null | undefined): T | null {
  if (!value) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

function sortMemberVoyages(voyages: UserVoyage[]): UserVoyage[] {
  return voyages.sort((left, right) => {
    const leftRank = enrollmentRank[left.enrollmentStatus ?? ""] ?? 50;
    const rightRank = enrollmentRank[right.enrollmentStatus ?? ""] ?? 50;

    if (leftRank !== rightRank) return leftRank - rightRank;
    return right.number - left.number;
  });
}

export const getUserVoyages = cache(async function getUserVoyages(
  userId: string,
): Promise<UserVoyage[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      id,
      status,
      submitted_at,
      voyage:voyages!applications_voyage_id_fkey (
        id,
        name,
        number,
        status,
        starts_at,
        ends_at
      ),
      enrollment:enrollments!enrollments_application_id_fkey (
        id,
        status
      )
    `,
    )
    .eq("applicant_id", userId)
    .neq("status", "draft")
    .order("submitted_at", { ascending: false, nullsFirst: false });

  if (error) {
    console.error("Failed to load user voyages:", error);
    return [];
  }

  const voyages = (data ?? [])
    .map((row) => {
      const voyage = unwrapRelation(row.voyage);
      if (!voyage) return null;

      const enrollment = unwrapRelation(row.enrollment);

      return {
        id: voyage.id,
        name: voyage.name,
        number: voyage.number,
        status: voyage.status,
        startsAt: voyage.starts_at,
        endsAt: voyage.ends_at,
        relation: "member" as const,
        applicationId: row.id,
        applicationStatus: row.status,
        submittedAt: row.submitted_at,
        enrollmentId: enrollment?.id ?? null,
        enrollmentStatus: enrollment?.status ?? null,
      } as UserVoyage;
    })
    .filter((voyage): voyage is UserVoyage => voyage !== null);

  return sortMemberVoyages(voyages);
});

export const getSelectableVoyages = cache(async function getSelectableVoyages(
  userId: string,
): Promise<UserVoyage[]> {
  const memberVoyages = await getUserVoyages(userId);
  const memberIds = new Set(memberVoyages.map((voyage) => voyage.id));

  const supabase = await createClient();
  const { data: openVoyages, error } = await supabase
    .from("voyages")
    .select("id, name, number, status, starts_at, ends_at")
    .eq("status", "applications_open")
    .order("number", { ascending: true });

  if (error) {
    console.error("Failed to load open courses for selection:", error);
    return memberVoyages;
  }

  const openApplyVoyages: UserVoyage[] = (openVoyages ?? [])
    .filter((voyage) => !memberIds.has(voyage.id))
    .map((voyage) => ({
      id: voyage.id,
      name: voyage.name,
      number: voyage.number,
      status: voyage.status,
      startsAt: voyage.starts_at,
      endsAt: voyage.ends_at,
      relation: "open_apply" as const,
      applicationId: null,
      applicationStatus: null,
      submittedAt: null,
      enrollmentId: null,
      enrollmentStatus: null,
    }));

  return [...memberVoyages, ...openApplyVoyages];
});
