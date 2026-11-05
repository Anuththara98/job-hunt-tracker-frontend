import { apiFetch } from "./client";
import type {
  JobApplication,
  JobApplicationPayload,
} from "../types/jobApplication";

export function listJobApplications(): Promise<JobApplication[]> {
  return apiFetch<JobApplication[]>("/api/job-applications");
}

export function createJobApplication(
  payload: JobApplicationPayload,
): Promise<JobApplication> {
  return apiFetch<JobApplication>("/api/job-applications", {
    method: "POST",
    body: payload,
  });
}

export function updateJobApplication(
  id: number,
  payload: JobApplicationPayload,
): Promise<JobApplication> {
  return apiFetch<JobApplication>(`/api/job-applications/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteJobApplication(id: number): Promise<void> {
  return apiFetch<void>(`/api/job-applications/${id}`, { method: "DELETE" });
}
