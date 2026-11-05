import { apiFetch } from "./client";
import type { Company, CompanyPayload } from "../types/company";

export function listCompanies(): Promise<Company[]> {
  return apiFetch<Company[]>("/api/companies");
}

export function createCompany(payload: CompanyPayload): Promise<Company> {
  return apiFetch<Company>("/api/companies", { method: "POST", body: payload });
}

export function updateCompany(
  id: number,
  payload: CompanyPayload,
): Promise<Company> {
  return apiFetch<Company>(`/api/companies/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function deleteCompany(id: number): Promise<void> {
  return apiFetch<void>(`/api/companies/${id}`, { method: "DELETE" });
}
