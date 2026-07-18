import { createClient as createServerClient } from "@/lib/supabase/server";

export type OpenVoyage = {
  id: string;
  name: string;
  deadline: string;
};

export async function listOpenVoyages(userId?: string): Promise<OpenVoyage[]> {
  const supabase = await createServerClient();
  const { data, error } = await supabase
    .from("voyages")
    .select("id, name, application_deadline")
    .eq("status", "applications_open")
    .order("application_deadline", { ascending: true, nullsFirst: false })
    .order("number", { ascending: true })
    .limit(10);

  if (error) {
    console.error("Failed to load open voyages for apply form:", error);
    return [];
  }

  let voyages = data ?? [];

  if (userId) {
    const { data: applications, error: applicationError } = await supabase
      .from("applications")
      .select("voyage_id")
      .eq("applicant_id", userId)
      .neq("status", "draft");

    if (applicationError) {
      console.error("Failed to filter applied voyages:", applicationError);
      return [];
    }

    const appliedVoyageIds = new Set((applications ?? []).map((row) => row.voyage_id));
    voyages = voyages.filter((voyage) => !appliedVoyageIds.has(voyage.id));
  }

  return voyages.map((voyage) => ({
    id: voyage.id,
    name: voyage.name,
    deadline: voyage.application_deadline
      ? new Date(voyage.application_deadline).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : "TBD",
  }));
}
