import { Application, ParticipantRole, ExperienceLevel } from "@/types";
import fs from "fs";
import path from "path";

const DATA_FILE = path.join(process.cwd(), "data", "applications.json");

interface StoredApplication extends Application {
  createdAt: string;
}

function ensureDataDir() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function readApplications(): StoredApplication[] {
  ensureDataDir();
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, "utf-8");
      return JSON.parse(content) as StoredApplication[];
    }
  } catch {
    // Ignore read errors, return empty array
  }
  return [];
}

function writeApplications(apps: StoredApplication[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_FILE, JSON.stringify(apps, null, 2));
}

export function getApplications(): Application[] {
  return readApplications().map((app) => {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { createdAt, ...rest } = app;
    return rest;
  });
}

export function getApplicationByEmail(email: string): Application | undefined {
  const apps = readApplications();
  return apps.find((a) => a.email.toLowerCase() === email.toLowerCase());
}

export interface ApplicationInput {
  fullName: string;
  email: string;
  role: ParticipantRole;
  experience: ExperienceLevel;
  skills: string[];
  hoursPerWeek: number;
  timezone: string;
  motivation: string;
  bio: string;
  portfolio: string;
  voyage: string;
}

function hoursToAvailability(hours: number): string {
  if (hours <= 5) return "1-5 hours/week";
  if (hours <= 10) return "5-10 hours/week";
  if (hours <= 15) return "10-15 hours/week";
  if (hours <= 20) return "15-20 hours/week";
  if (hours <= 30) return "20-30 hours/week";
  return "30+ hours/week";
}

export function createApplication(data: ApplicationInput): Application {
  const apps = readApplications();

  const experienceYears: Record<ExperienceLevel, string> = {
    Beginner: "0-2 years",
    Intermediate: "2-5 years",
    Advanced: "5+ years",
  };

  const newApp: StoredApplication = {
    id: `app-${Date.now()}`,
    name: data.fullName,
    email: data.email,
    avatar: `https://i.pravatar.cc/100?u=${encodeURIComponent(data.email)}`,
    role: data.role,
    experience: data.experience,
    years: experienceYears[data.experience],
    status: "pending_review",
    date: new Date().toISOString().split("T")[0],
    voyage: data.voyage || "Voyage 51",
    bio: data.bio,
    skills: data.skills,
    availability: hoursToAvailability(data.hoursPerWeek),
    motivation: data.motivation,
    portfolio: data.portfolio,
    timezone: data.timezone,
    reviewNotes: "",
    createdAt: new Date().toISOString(),
  };

  apps.push(newApp);
  writeApplications(apps);

  /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
  const { createdAt, ...app } = newApp;
  return app;
}

export function hasDuplicateEmail(email: string): boolean {
  return getApplicationByEmail(email) !== undefined;
}
