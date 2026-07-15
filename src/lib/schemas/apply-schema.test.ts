import { describe, it, expect } from "vitest";
import {
  stepRoleExperienceSchema,
  stepSkillsSchema,
  stepAvailabilitySchema,
  stepMotivationSchema,
  applyFormSchema,
} from "./apply-schema";

describe("Apply Form Schemas", () => {
  describe("stepRoleExperienceSchema", () => {
    it("validates correct role and experience data", () => {
      const validData = {
        role: "Frontend",
        experience: "Intermediate",
      };
      const result = stepRoleExperienceSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails if role is invalid", () => {
      const invalidData = {
        role: "InvalidRole",
        experience: "Intermediate",
      };
      const result = stepRoleExperienceSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("stepSkillsSchema", () => {
    it("validates correct skills data", () => {
      const validData = {
        skills: ["React", "TypeScript", "Node.js"],
      };
      const result = stepSkillsSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails if no skills", () => {
      const invalidData = {
        skills: [],
      };
      const result = stepSkillsSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("stepAvailabilitySchema", () => {
    it("validates correct availability data", () => {
      const validData = {
        hoursPerWeek: 20,
        timezone: "America/New_York",
        voyage: "Course 51",
      };
      const result = stepAvailabilitySchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails if hoursPerWeek is missing", () => {
      const invalidData = {
        hoursPerWeek: 0,
        timezone: "America/New_York",
      };
      const result = stepAvailabilitySchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("stepMotivationSchema", () => {
    it("validates correct motivation data", () => {
      const validData = {
        motivation: "I want to join because I am passionate about building great software.",
        bio: "I am a software developer with 3 years of experience.",
        portfolio: "https://github.com/janedoe",
      };
      const result = stepMotivationSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it("fails if motivation is too short", () => {
      const invalidData = {
        motivation: "Short",
        bio: "I am a software developer.",
      };
      const result = stepMotivationSchema.safeParse(invalidData);
      expect(result.success).toBe(false);
    });
  });

  describe("applyFormSchema", () => {
    it("validates the complete form submission correctly", () => {
      const validData = {
        role: "Frontend",
        experience: "Intermediate",
        skills: ["React", "TypeScript"],
        hoursPerWeek: 20,
        timezone: "America/New_York",
        voyage: "Course 51",
        motivation: "I want to join because I am passionate about building great software.",
        bio: "I am a software developer with 3 years of experience.",
        portfolio: "https://github.com/janedoe",
      };
      const result = applyFormSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
