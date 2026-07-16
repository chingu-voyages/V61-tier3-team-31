import { requireStaff } from "@/lib/auth/queries";
import { listTeams, listAvailableParticipants, getCurrentVoyage } from "@/lib/admin/teams";
import { TeamsClient } from "./teams-client";

export default async function AdminTeamsPage() {
  const user = await requireStaff();
  const voyageId = await getCurrentVoyage();

  const [teams, participants] = await Promise.all([
    listTeams(voyageId ?? undefined).catch(() => []),
    listAvailableParticipants().catch(() => []),
  ]);

  return (
    <TeamsClient
      initialTeams={teams}
      initialParticipants={participants}
      userId={user.id}
      voyageId={voyageId ?? ""}
    />
  );
}
