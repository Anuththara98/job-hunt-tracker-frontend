import { z } from "zod";
import { JOB_APPLICATION_STATUSES, WORK_TYPES } from "../types/jobApplication";

export const jobApplicationSchema = z.object({
  companyId: z.string().min(1, "Company is required"),
  jobTitle: z
    .string()
    .min(1, "Job title is required")
    .max(150, "Job title must be less than 150 characters"),
  jobLink: z.string().max(500, "Job link must be less than 500 characters"),
  location: z.string().max(100, "Location must be less than 100 characters"),
  workType: z.enum(WORK_TYPES),
  status: z.enum(JOB_APPLICATION_STATUSES),
  appliedDate: z
    .string()
    .refine((val) => val === "" || new Date(`${val}T00:00:00`) <= new Date(), {
      message: "Applied date cannot be in the future",
    }),
  closingDate: z.string(),
  notes: z.string().max(1000, "Notes must be less than 1000 characters"),
});
export type JobApplicationFormValues = z.infer<typeof jobApplicationSchema>;
