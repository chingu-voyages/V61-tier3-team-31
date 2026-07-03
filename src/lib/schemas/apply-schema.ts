import { z } from "zod/v4";

const stepAccountBase = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
});

export const stepAccountSchema = stepAccountBase.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  },
);

export const stepAboutYouSchema = z.object({
  bio: z.string().min(50, "Bio must be at least 50 characters").max(500),
  github: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  profilePhoto: z.any().optional(),
});

export const stepSkillsRoleSchema = z.object({
  role: z.enum(["developer", "designer", "product-manager"]),
  experienceLevel: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  yearsExperience: z.number().min(0).max(50).optional(),
  skills: z
    .array(z.string())
    .min(1, "Please add at least one skill")
    .max(10, "Maximum 10 skills allowed"),
});

export const stepAvailabilitySchema = z.object({
  hoursPerWeek: z.number().min(1, "Please specify hours per week").max(80),
  timezone: z.string().min(1, "Timezone is required"),
  daysAvailable: z.array(z.string()).min(1, "Select at least one day"),
  timeSlotsPerDay: z.array(z.string()).min(1, "Select at least one preferred time slot"),
});

export const applyFormSchema = z
  .object({
    ...stepAccountBase.shape,
    ...stepAboutYouSchema.shape,
    ...stepSkillsRoleSchema.shape,
    ...stepAvailabilitySchema.shape,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type StepAccountData = z.infer<typeof stepAccountSchema>;
export type StepAboutYouData = z.infer<typeof stepAboutYouSchema>;
export type StepSkillsRoleData = z.infer<typeof stepSkillsRoleSchema>;
export type StepAvailabilityData = z.infer<typeof stepAvailabilitySchema>;
export type ApplyFormData = z.infer<typeof applyFormSchema>;
