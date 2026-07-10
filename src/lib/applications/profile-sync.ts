import type { ApplyFormData } from "@/lib/schemas/apply-schema";

export type ApplyProfileDraft = {
  fullName: string;
  role?: ApplyFormData["role"];
  skills: string[];
  timezone: string;
  bio: string;
  portfolio: string;
};

export type ProfileSyncField = "fullName" | "role" | "skills" | "timezone" | "bio" | "portfolio";

export type ProfileSyncDiff = {
  field: ProfileSyncField;
  label: string;
  profileValue: string;
  applicationValue: string;
};

export type ProfileSyncPlan = {
  autoSyncedFields: ProfileSyncField[];
  differentFields: ProfileSyncDiff[];
};

export const PROFILE_SYNC_FIELD_LABELS: Record<ProfileSyncField, string> = {
  fullName: "Full name",
  role: "Preferred role",
  skills: "Skills",
  timezone: "Timezone",
  bio: "Bio",
  portfolio: "Portfolio",
};

export function normalizeProfileText(value: string | null | undefined): string {
  return (value ?? "").trim();
}

export function normalizeNullableUrl(value: string | null | undefined): string {
  return normalizeProfileText(value);
}

export function normalizeRole(
  value:
    | ApplyFormData["role"]
    | "frontend"
    | "backend"
    | "fullstack"
    | "design"
    | "product"
    | null
    | undefined,
): ApplyFormData["role"] | undefined {
  if (!value) {
    return undefined;
  }

  if (value === "frontend") return "Frontend";
  if (value === "backend") return "Backend";
  if (value === "fullstack") return "Fullstack";
  if (value === "design") return "Design";
  if (value === "product") return "Product";

  return value;
}

export function normalizeSkillNames(skills: string[]): string[] {
  return Array.from(new Set(skills.map((skill) => skill.trim()).filter(Boolean))).sort((a, b) =>
    a.localeCompare(b),
  );
}

function formatArrayValue(value: string[]): string {
  return value.join(", ");
}

function compareTextField(
  field: Exclude<ProfileSyncField, "skills" | "role">,
  profileValue: string,
  applicationValue: string,
  autoSyncWhenBlank: boolean,
): ProfileSyncPlan {
  const autoSyncedFields: ProfileSyncField[] = [];
  const differentFields: ProfileSyncDiff[] = [];

  if (profileValue === applicationValue) {
    return { autoSyncedFields, differentFields };
  }

  if (autoSyncWhenBlank && profileValue === "" && applicationValue !== "") {
    autoSyncedFields.push(field);
    return { autoSyncedFields, differentFields };
  }

  if (applicationValue !== "") {
    differentFields.push({
      field,
      label: PROFILE_SYNC_FIELD_LABELS[field],
      profileValue,
      applicationValue,
    });
  }

  return { autoSyncedFields, differentFields };
}

export function buildProfileSyncPlan(
  profile: ApplyProfileDraft,
  application: ApplyFormData,
): ProfileSyncPlan {
  const autoSyncedFields: ProfileSyncField[] = [];
  const differentFields: ProfileSyncDiff[] = [];

  const fullNameComparison = compareTextField(
    "fullName",
    normalizeProfileText(profile.fullName),
    normalizeProfileText(application.fullName),
    true,
  );
  autoSyncedFields.push(...fullNameComparison.autoSyncedFields);
  differentFields.push(...fullNameComparison.differentFields);

  const bioComparison = compareTextField(
    "bio",
    normalizeProfileText(profile.bio),
    normalizeProfileText(application.bio),
    true,
  );
  autoSyncedFields.push(...bioComparison.autoSyncedFields);
  differentFields.push(...bioComparison.differentFields);

  const portfolioComparison = compareTextField(
    "portfolio",
    normalizeNullableUrl(profile.portfolio),
    normalizeNullableUrl(application.portfolio),
    true,
  );
  autoSyncedFields.push(...portfolioComparison.autoSyncedFields);
  differentFields.push(...portfolioComparison.differentFields);

  const currentTimezone = normalizeProfileText(profile.timezone);
  const submittedTimezone = normalizeProfileText(application.timezone);
  const timezoneIsPlaceholder = currentTimezone === "" || currentTimezone === "UTC";
  const timezoneComparison = compareTextField(
    "timezone",
    currentTimezone,
    submittedTimezone,
    timezoneIsPlaceholder,
  );
  autoSyncedFields.push(...timezoneComparison.autoSyncedFields);
  differentFields.push(...timezoneComparison.differentFields);

  const currentRole = normalizeRole(profile.role);
  const submittedRole = normalizeRole(application.role);
  if (currentRole !== submittedRole && submittedRole) {
    if (!currentRole) {
      autoSyncedFields.push("role");
    } else {
      differentFields.push({
        field: "role",
        label: PROFILE_SYNC_FIELD_LABELS.role,
        profileValue: currentRole,
        applicationValue: submittedRole,
      });
    }
  }

  const currentSkills = normalizeSkillNames(profile.skills);
  const submittedSkills = normalizeSkillNames(application.skills);
  if (
    formatArrayValue(currentSkills) !== formatArrayValue(submittedSkills) &&
    submittedSkills.length > 0
  ) {
    if (currentSkills.length === 0) {
      autoSyncedFields.push("skills");
    } else {
      differentFields.push({
        field: "skills",
        label: PROFILE_SYNC_FIELD_LABELS.skills,
        profileValue: formatArrayValue(currentSkills),
        applicationValue: formatArrayValue(submittedSkills),
      });
    }
  }

  return {
    autoSyncedFields: Array.from(new Set(autoSyncedFields)),
    differentFields,
  };
}
