import { useMutation } from "@tanstack/react-query";
import { generateCoverLetter } from "../api/coverLetter";
import type { CoverLetterPayload } from "../types/coverLetter";

export function useGenerateCoverLetter(jobApplicationId: number) {
  return useMutation({
    mutationFn: (payload: CoverLetterPayload) =>
      generateCoverLetter(jobApplicationId, payload),
  });
}
