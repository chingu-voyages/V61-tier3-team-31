"use server";

import { createTeam as createTeamInDB } from "@/lib/admin/teams";
import { requireStaff } from "@/lib/auth/queries";

export async function createTeamAction(
  name: string,
  description: string,
  voyageId: string,
  enrollmentIds: string[],
): Promise<{ ok: true; teamId: string } | { error: string }> {
  try {
    const user = await requireStaff();
    const teamId = await createTeamInDB(name, description, voyageId, enrollmentIds, user.id);
    return { ok: true, teamId };
  } catch (err) {
    return { error: err instanceof Error ? err.message : "Failed to create team" };
  }
}
