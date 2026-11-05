import { z } from "zod";

export const coverLetterSchema = z.object({
  userBio: z.string().max(500, "User bio must be less than 500 characters"),
});
export type CoverLetterFormValues = z.infer<typeof coverLetterSchema>;
