import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createJobApplication,
  deleteJobApplication,
  listJobApplications,
  updateJobApplication,
} from "../api/jobApplications";
import type { JobApplicationPayload } from "../types/jobApplication";

export const JOB_APPLICATIONS_KEY = ["jobApplications"] as const;

export function useJobApplications() {
  return useQuery({
    queryKey: JOB_APPLICATIONS_KEY,
    queryFn: listJobApplications,
  });
}

export function useCreateJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: JobApplicationPayload) =>
      createJobApplication(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: JOB_APPLICATIONS_KEY }),
  });
}

export function useUpdateJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: JobApplicationPayload;
    }) => updateJobApplication(id, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: JOB_APPLICATIONS_KEY }),
  });
}

export function useDeleteJobApplication() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteJobApplication(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: JOB_APPLICATIONS_KEY }),
  });
}
