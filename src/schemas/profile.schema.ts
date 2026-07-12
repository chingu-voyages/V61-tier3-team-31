import { z } from "zod";

export const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(2, "Full name must be at least 2 characters")
    .max(120, "Full name must be at most 120 characters"),
  preferredRole: z
    .enum(["frontend", "backend", "fullstack", "design", "product"])
    .or(z.literal("")),
  timezone: z.string().trim().min(1, "Timezone is required").max(120, "Timezone is too long"),
  portfolioUrl: z
    .string()
    .trim()
    .refine((value) => value === "" || z.url().safeParse(value).success, "Enter a valid URL"),
  bio: z.string().trim().max(500, "Bio must be at most 500 characters"),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
