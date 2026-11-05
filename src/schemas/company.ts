import { z } from "zod";

export const companySchema = z.object({
  name: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be less than 100 characters"),
  industry: z.string().max(100, "Industry must be less than 100 characters"),
  website: z.string().max(255, "Website must be less than 255 characters"),
  location: z.string().max(100, "Location must be less than 100 characters"),
  notes: z.string().max(1000, "Notes must be less than 1000 characters"),
});
export type CompanyFormValues = z.infer<typeof companySchema>;
