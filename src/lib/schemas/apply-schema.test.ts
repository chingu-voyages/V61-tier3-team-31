import { describe, it, expect } from "vitest";
import {
  stepAccountSchema,
  stepRoleExperienceSchema,
  stepSkillsSchema,
  stepAvailabilitySchema,
  stepMotivationSchema,
  applyFormSchema,
} from "./apply-schema";

describe("Apply Form Schemas", () => {
  describe("stepAccountSchema", () => {
    it("validates valid data", () => {
      const result = stepAccountSchema.safeParse({
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short name", () => {
      const result = stepAccountSchema.safeParse({
        fullName: "J",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain("fullName");
    });

    it("rejects invalid email", () => {
      const result = stepAccountSchema.safeParse({
        fullName: "John Doe",
        email: "not-an-email",
        password: "password123",
        confirmPassword: "password123",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain("email");
    });

    it("rejects short password", () => {
      const result = stepAccountSchema.safeParse({
        fullName: "John Doe",
        email: "john@example.com",
        password: "short",
        confirmPassword: "short",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain("password");
    });

    it("rejects mismatched passwords", () => {
      const result = stepAccountSchema.safeParse({
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "different123",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain("confirmPassword");
    });
  });

  describe("stepRoleExperienceSchema", () => {
    it("validates valid data", () => {
      const result = stepRoleExperienceSchema.safeParse({
        role: "developer",
        experienceLevel: "intermediate",
        yearsExperience: 3,
      });
      expect(result.success).toBe(true);
    });

    it("rejects missing role", () => {
      const result = stepRoleExperienceSchema.safeParse({
        role: "",
        experienceLevel: "intermediate",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("stepSkillsSchema", () => {
    it("validates valid data", () => {
      const result = stepSkillsSchema.safeParse({
        skills: ["React", "TypeScript", "Node.js"],
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty skills", () => {
      const result = stepSkillsSchema.safeParse({
        skills: [],
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain("skills");
    });
  });

  describe("stepAvailabilitySchema", () => {
    it("validates valid data", () => {
      const result = stepAvailabilitySchema.safeParse({
        hoursPerWeek: "15-20 hours/week",
        timezone: "America/New_York",
        voyage: "Voyage 51",
      });
      expect(result.success).toBe(true);
    });

    it("rejects empty hours", () => {
      const result = stepAvailabilitySchema.safeParse({
        hoursPerWeek: "",
        timezone: "UTC",
        voyage: "",
      });
      expect(result.success).toBe(false);
    });

    it("rejects empty timezone", () => {
      const result = stepAvailabilitySchema.safeParse({
        hoursPerWeek: "15-20 hours/week",
        timezone: "",
        voyage: "",
      });
      expect(result.success).toBe(false);
    });
  });

  describe("stepMotivationSchema", () => {
    it("validates valid data", () => {
      const result = stepMotivationSchema.safeParse({
        motivation: "I want to join to learn and grow with other developers.",
        bio: "I am a passionate developer with 5 years of experience.",
        github: "https://github.com/johndoe",
        portfolio: "https://johndoe.dev",
        profilePhoto: "https://example.com/photo.jpg",
      });
      expect(result.success).toBe(true);
    });

    it("rejects short bio", () => {
      const result = stepMotivationSchema.safeParse({
        motivation: "I want to join to learn and grow with other developers.",
        bio: "Short",
        github: "",
        portfolio: "",
        profilePhoto: "",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain("bio");
    });

    it("rejects short motivation", () => {
      const result = stepMotivationSchema.safeParse({
        motivation: "Short",
        bio: "I am a passionate developer with 5 years of experience.",
        github: "",
        portfolio: "",
        profilePhoto: "",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0].path).toContain("motivation");
    });

    it("accepts empty optional fields", () => {
      const result = stepMotivationSchema.safeParse({
        motivation: "I want to join to learn and grow with other developers.",
        bio: "A reasonable bio length here.",
        github: "",
        portfolio: "",
        profilePhoto: "",
      });
      expect(result.success).toBe(true);
    });
  });

  describe("applyFormSchema (merged)", () => {
    it("validates complete form", () => {
      const result = applyFormSchema.safeParse({
        fullName: "John Doe",
        email: "john@example.com",
        password: "password123",
        confirmPassword: "password123",
        role: "developer",
        experienceLevel: "intermediate",
        yearsExperience: 3,
        skills: ["React", "TypeScript", "Node.js"],
        hoursPerWeek: "15-20 hours/week",
        timezone: "America/New_York",
        voyage: "Voyage 51",
        motivation: "I want to join to learn and grow with other developers.",
        bio: "I am a passionate developer with 5 years of experience.",
        github: "https://github.com/johndoe",
        portfolio: "https://johndoe.dev",
        profilePhoto: "",
      });
      expect(result.success).toBe(true);
    });
  });
});
