"use server";

import { createTeam as createTeamInDB } from "@/lib/admin/teams";

export async function createTeamAction(
  name: string,
  description: string,
  voyageId: string,
  enrollmentIds: string[],
  createdBy: string,
): Promise<{ ok: true; teamId: string } | { error: string }> {
  try {
    const teamId = await createTeamInDB(name, description, voyageId, enrollmentIds, createdBy);
    return { ok: true, teamId };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create team" };
  }
}
