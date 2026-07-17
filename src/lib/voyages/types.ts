import type { Database } from "@/types/database";

export type VoyageStatus = Database["public"]["Enums"]["voyage_status"];
export type ApplicationStatus = Database["public"]["Enums"]["application_status"];
export type EnrollmentStatus = Database["public"]["Enums"]["enrollment_status"];
export type VoyageRelation = "member" | "open_apply";

export type UserVoyage = {
  id: string;
  name: string;
  number: number;
  status: VoyageStatus;
  startsAt: string | null;
  endsAt: string | null;
  relation: VoyageRelation;
  applicationId: string | null;
  applicationStatus: ApplicationStatus | null;
  submittedAt: string | null;
  enrollmentId: string | null;
  enrollmentStatus: EnrollmentStatus | null;
};
