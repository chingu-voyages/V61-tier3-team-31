import type { ProfileFormData } from "@/schemas/profile.schema";

export function getProfileFormDefaults(data: {
  fullName: string;
  preferredRole: ProfileFormData["preferredRole"];
  timezone: string;
  portfolioUrl: string;
  bio: string;
}): ProfileFormData {
  return {
    fullName: data.fullName,
    preferredRole: data.preferredRole,
    timezone: data.timezone,
    portfolioUrl: data.portfolioUrl,
    bio: data.bio,
  };
}
