import type { AuthUser } from "@/lib/auth/queries";
import type { Database } from "@/types/database";
import { listProfileSkillNames } from "@/lib/profile/profile-skills";

type ParticipantRole = Database["public"]["Enums"]["participant_role"];

export type ParticipantProfileEditorData = {
  email: string;
  fullName: string;
  bio: string;
  timezone: string;
  portfolioUrl: string;
  preferredRole: ParticipantRole | "";
  skills: string[];
};

export async function getParticipantProfileEditorData(
  user: AuthUser,
): Promise<ParticipantProfileEditorData> {
  const skills = await listProfileSkillNames(user.id);

  return {
    email: user.email,
    fullName: user.profile?.full_name ?? "",
    bio: user.profile?.bio ?? "",
    timezone: user.profile?.timezone ?? "UTC",
    portfolioUrl: user.profile?.portfolio_url ?? "",
    preferredRole: user.profile?.preferred_role ?? "",
    skills,
  };
}
