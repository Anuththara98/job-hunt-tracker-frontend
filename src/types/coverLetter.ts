export interface CoverLetterPayload {
  userBio: string | null;
}

export interface CoverLetterResponse {
  generatedLetter: string;
  jobTitle: string;
  companyName: string;
}