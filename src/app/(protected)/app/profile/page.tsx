import { requireUser } from "@/lib/auth/queries";
import { getParticipantProfileEditorData } from "@/lib/profile/profile-editor";
import { ProfileEditorShell } from "@/components/profile/profile-editor-shell";

export default async function ProfilePage() {
  const user = await requireUser();
  const profile = await getParticipantProfileEditorData(user);

  return <ProfileEditorShell profile={profile} />;
}
