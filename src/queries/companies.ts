import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createCompany,
  deleteCompany,
  listCompanies,
  updateCompany,
} from "../api/companies";
import type { CompanyPayload } from "../types/company";

export const COMPANIES_KEY = ["companies"] as const;

export function useCompanies() {
  return useQuery({ queryKey: COMPANIES_KEY, queryFn: listCompanies });
}

export function useCreateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompanyPayload) => createCompany(payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPANIES_KEY }),
  });
}

export function useUpdateCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CompanyPayload }) =>
      updateCompany(id, payload),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPANIES_KEY }),
  });
}

export function useDeleteCompany() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteCompany(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: COMPANIES_KEY }),
  });
}
