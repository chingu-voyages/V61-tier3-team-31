"use server";

import { revalidatePath } from "next/cache";
import { requireUser } from "@/lib/auth/queries";
import { profileSchema, type ProfileFormData } from "@/schemas/profile.schema";
import { updateProfile } from "@/lib/profile/update-profile";

export type SaveProfileResult = { ok: true; profile: ProfileFormData } | { error: string };

export async function saveProfile(data: ProfileFormData): Promise<SaveProfileResult> {
  const user = await requireUser();
  const parsed = profileSchema.safeParse(data);

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please review your profile fields." };
  }

  try {
    const profile = await updateProfile(user.id, parsed.data);

    revalidatePath("/app/profile");
    revalidatePath("/app/apply");

    return { ok: true, profile };
  } catch {
    return { error: "We could not save your profile right now." };
  }
}
