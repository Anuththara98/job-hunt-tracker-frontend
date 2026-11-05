export const WORK_TYPES = ["ONSITE", "REMOTE", "HYBRID"] as const;
export type WorkType = (typeof WORK_TYPES)[number];

export const JOB_APPLICATION_STATUSES = [
  "APPLIED",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
] as const;
export type JobApplicationStatus = (typeof JOB_APPLICATION_STATUSES)[number];

export interface JobApplication {
  id: number;
  companyId: number;
  companyName: string;
  jobTitle: string;
  jobLink: string | null;
  location: string | null;
  workType: WorkType;
  status: JobApplicationStatus;
  appliedDate: string | null;
  closingDate: string | null;
  notes: string | null;
}

export interface JobApplicationPayload {
  companyId: number;
  jobTitle: string;
  jobLink: string | null;
  location: string | null;
  workType: WorkType;
  status: JobApplicationStatus;
  appliedDate: string | null;
  closingDate: string | null;
  notes: string | null;
}
