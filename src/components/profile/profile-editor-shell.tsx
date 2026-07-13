import type { ParticipantProfileEditorData } from "@/lib/profile/profile-editor";
import { ProfileEditorForm } from "@/components/profile/profile-editor-form";

export function ProfileEditorShell({ profile }: { profile: ParticipantProfileEditorData }) {
  return (
    <section className="mx-auto max-w-[1200px] space-y-6">
      <ProfileEditorForm profile={profile} />
    </section>
  );
}
