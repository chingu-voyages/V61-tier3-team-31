import { z } from "zod/v4";

const stepAccountBase = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters").max(100),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(128),
  confirmPassword: z.string(),
});

export const stepAccountSchema = stepAccountBase.refine(
  (data) => data.password === data.confirmPassword,
  {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  },
);

export const stepRoleExperienceSchema = z.object({
  role: z
    .enum({
      developer: "developer",
      designer: "designer",
      "product-manager": "product-manager",
    })
    .describe("Please select a role"),
  experienceLevel: z
    .enum({
      beginner: "beginner",
      intermediate: "intermediate",
      advanced: "advanced",
      expert: "expert",
    })
    .describe("Please select an experience level"),
  yearsExperience: z.coerce.number().int().min(0).max(50).optional(),
});

export const stepSkillsSchema = z.object({
  skills: z.array(z.string()).min(1, "Select at least one skill"),
});

export const stepAvailabilitySchema = z.object({
  hoursPerWeek: z.string().min(1, "Please select your availability"),
  timezone: z.string().min(1, "Timezone is required"),
  voyage: z.string().optional(),
});

export const stepMotivationSchema = z.object({
  motivation: z
    .string()
    .min(20, "Motivation must be at least 20 characters")
    .max(500, "Motivation must be 500 characters or less"),
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(500, "Bio must be 500 characters or less"),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  portfolio: z.string().url("Invalid portfolio URL").optional().or(z.literal("")),
  profilePhoto: z.string().url("Invalid image URL").optional().or(z.literal("")),
});

export const applyFormSchema = z
  .object({
    ...stepAccountBase.shape,
    ...stepRoleExperienceSchema.shape,
    ...stepSkillsSchema.shape,
    ...stepAvailabilitySchema.shape,
    ...stepMotivationSchema.shape,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type StepAccountData = z.infer<typeof stepAccountSchema>;
export type StepRoleExperienceData = z.infer<typeof stepRoleExperienceSchema>;
export type StepSkillsData = z.infer<typeof stepSkillsSchema>;
export type StepAvailabilityData = z.infer<typeof stepAvailabilitySchema>;
export type StepMotivationData = z.infer<typeof stepMotivationSchema>;
export type ApplyFormData = z.infer<typeof applyFormSchema>;
