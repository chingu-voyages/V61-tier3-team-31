import type { ParticipantProfileEditorData } from "@/lib/profile/profile-editor";
import { ProfileEditorForm } from "@/components/profile/profile-editor-form";

export function ProfileEditorShell({ profile }: { profile: ParticipantProfileEditorData }) {
  return (
    <section className="rounded-[28px] border border-border bg-card p-8 shadow-sm">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
        Participant workspace
      </span>
      <h1 className="mt-4 font-outfit text-3xl font-semibold tracking-tight text-foreground">
        Profile
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-muted-foreground">
        Keep your reusable participant details current so future applications start from the right
        profile.
      </p>
      <ProfileEditorForm profile={profile} />
    </section>
  );
}
