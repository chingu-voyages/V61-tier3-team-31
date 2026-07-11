import { createClient as createServerClient } from "@/lib/supabase/server";

export type OpenVoyage = {
  id: string;
  name: string;
  deadline: string;
};

export async function listOpenVoyages(): Promise<OpenVoyage[]> {
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

  return data.map((voyage) => ({
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
