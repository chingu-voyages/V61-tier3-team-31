import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database";

type ApplicationStatus = Database["public"]["Enums"]["application_status"];
type EnrollmentStatus = Database["public"]["Enums"]["enrollment_status"];

export type AdminApplicationListItem = {
  id: string;
  status: ApplicationStatus;
  preferredRole: string | null;
  experience: string | null;
  weeklyHours: number | null;
  timezone: string | null;
  submittedAt: string | null;
  decidedAt: string | null;
  applicantName: string;
  voyageName: string;
  voyageNumber: number;
  enrollmentId: string | null;
  enrollmentStatus: EnrollmentStatus | null;
};

export async function listAdminApplications(): Promise<AdminApplicationListItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("applications")
    .select(
      `
      id,
      status,
      preferred_role,
      experience,
      weekly_hours,
      timezone,
      submitted_at,
      decided_at,
      applicant:profiles!applications_applicant_id_fkey ( full_name ),
      voyage:voyages!applications_voyage_id_fkey ( name, number ),
      enrollment:enrollments!enrollments_application_id_fkey ( id, status )
    `,
    )
    .neq("status", "draft")
    .order("submitted_at", { ascending: false, nullsFirst: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => {
    const applicant = Array.isArray(row.applicant) ? row.applicant[0] : row.applicant;
    const voyage = Array.isArray(row.voyage) ? row.voyage[0] : row.voyage;
    const enrollment = Array.isArray(row.enrollment) ? row.enrollment[0] : row.enrollment;

    return {
      id: row.id,
      status: row.status,
      preferredRole: row.preferred_role,
      experience: row.experience,
      weeklyHours: row.weekly_hours,
      timezone: row.timezone,
      submittedAt: row.submitted_at,
      decidedAt: row.decided_at,
      applicantName: applicant?.full_name ?? "Unknown applicant",
      voyageName: voyage?.name ?? "Unknown voyage",
      voyageNumber: voyage?.number ?? 0,
      enrollmentId: enrollment?.id ?? null,
      enrollmentStatus: enrollment?.status ?? null,
    };
  });
}
