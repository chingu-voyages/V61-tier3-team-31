import { describe, it, expect } from "vitest";
import {
  stepAccountSchema,
  stepAboutYouSchema,
  stepSkillsRoleSchema,
  stepAvailabilitySchema,
  applyFormSchema,
} from "./apply-schema";

describe("Apply Form Schemas", () => {
  describe("stepAccountSchema", () => {
    it("validates a correct account object", () => {
      const validData = {
        fullName: "Jane Doe",
        email: "jane@example.com",
      };
      const result = stepAccountSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails if email is invalid", () => {
      const invalidData = {
        fullName: "Jane Doe",
        email: "not-an-email",
      };
      const result = stepAccountSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("stepAboutYouSchema", () => {
    it("validates correct about you data", () => {
      const validData = {
        bio: "This is a test bio that is perfectly at least fifty characters long so that it passes validation properly without any issues whatsoever.",
        github: "https://github.com/janedoe",
        portfolio: "https://janedoe.com",
      };
      const result = stepAboutYouSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails if bio is too short", () => {
      const invalidData = {
        bio: "Too short",
      };
      const result = stepAboutYouSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("stepSkillsRoleSchema", () => {
    it("validates correct skills and role data", () => {
      const validData = {
        role: "developer",
        experienceLevel: "intermediate",
        yearsExperience: 3,
        skills: ["React", "TypeScript"],
      };
      const result = stepSkillsRoleSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("stepAvailabilitySchema", () => {
    it("validates correct availability data", () => {
      const validData = {
        hoursPerWeek: 20,
        timezone: "UTC",
        daysAvailable: ["Monday", "Tuesday"],
        timeSlotsPerDay: ["morning", "afternoon"],
      };
      const result = stepAvailabilitySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });

  describe("applyFormSchema", () => {
    it("validates the complete form submission correctly", () => {
      const validData = {
        fullName: "Jane Doe",
        email: "jane@example.com",
        bio: "This is a test bio that is perfectly at least fifty characters long so that it passes validation properly without any issues whatsoever.",
        github: "https://github.com/janedoe",
        portfolio: "https://janedoe.com",
        role: "developer",
        experienceLevel: "intermediate",
        yearsExperience: 3,
        skills: ["React", "TypeScript"],
        hoursPerWeek: 20,
        timezone: "UTC",
        daysAvailable: ["Monday", "Tuesday"],
        timeSlotsPerDay: ["morning", "afternoon"],
      };
      const result = applyFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
