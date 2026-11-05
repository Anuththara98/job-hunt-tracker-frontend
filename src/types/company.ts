export interface Company {
  id: number;
  name: string;
  industry: string | null;
  website: string | null;
  location: string | null;
  notes: string | null;
}

export interface CompanyPayload {
  name: string;
  industry: string | null;
  website: string | null;
  location: string | null;
  notes: string | null;
}
