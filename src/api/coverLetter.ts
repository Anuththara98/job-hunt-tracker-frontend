import { apiFetch } from "./client";
import type { CoverLetterPayload, CoverLetterResponse } from "../types/coverLetter";

export function generateCoverLetter(
  jobApplicationId: number,
  payload: CoverLetterPayload,
): Promise<CoverLetterResponse> {
  return apiFetch<CoverLetterResponse>(`/api/job-applications/${jobApplicationId}/cover-letter`, {
    method: "POST",
    body: payload,
  });
}
