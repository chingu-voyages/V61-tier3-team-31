import { z } from "zod/v4";

const stepRoleExperienceSchema = z.object({
  role: z.enum(["Frontend", "Backend", "Fullstack", "Design", "Product"], {
    message: "Please select a role.",
  }),
  experience: z.enum(["Beginner", "Intermediate", "Advanced"], {
    message: "Please select your experience level.",
  }),
});

const stepSkillsSchema = z.object({
  skills: z
    .array(z.string())
    .min(1, "Please add at least one skill.")
    .max(15, "Maximum 15 skills allowed"),
});

const stepAvailabilitySchema = z.object({
  hoursPerWeek: z.number().min(1, "Please specify hours per week.").max(80),
  timezone: z.string().min(1, "Please select your timezone."),
  voyage: z.string().optional(),
});

const stepMotivationSchema = z.object({
  motivation: z
    .string()
    .min(20, "Please write at least 20 characters.")
    .max(500, "Maximum 500 characters allowed"),
  bio: z.string().min(10, "Please write at least 10 characters."),
  portfolio: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

export const applyFormSchema = z.object({
  ...stepRoleExperienceSchema.shape,
  ...stepSkillsSchema.shape,
  ...stepAvailabilitySchema.shape,
  ...stepMotivationSchema.shape,
});

export type StepRoleExperienceData = z.infer<typeof stepRoleExperienceSchema>;
export type StepSkillsData = z.infer<typeof stepSkillsSchema>;
export type StepAvailabilityData = z.infer<typeof stepAvailabilitySchema>;
export type StepMotivationData = z.infer<typeof stepMotivationSchema>;
export type ApplyFormData = z.infer<typeof applyFormSchema>;

export { stepRoleExperienceSchema, stepSkillsSchema, stepAvailabilitySchema, stepMotivationSchema };
