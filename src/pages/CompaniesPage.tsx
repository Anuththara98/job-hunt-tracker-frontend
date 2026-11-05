import { useEffect, useState } from "react";
import { AppHeader } from "../components/AppHeader";
import { CompanyFormModal } from "../components/CompanyFormModal";
import { ApiError } from "../api/client";
import { createCompany, deleteCompany, listCompanies, updateCompany } from "../api/companies";
import { useToast } from "../context/useToast";
import { useConfirm } from "../context/useConfirm";
import type { Company, CompanyPayload } from "../types/company";

export function CompaniesPage() {
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  async function loadCompanies() {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await listCompanies();
      setCompanies(data);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Failed to load companies.");
    } finally {
      setIsLoading(false);
    }
  }

  function openAddModal() {
    setEditingCompany(null);
    setIsModalOpen(true);
  }

  function openEditModal(company: Company) {
    setEditingCompany(company);
    setIsModalOpen(true);
  }

  async function handleFormSubmit(payload: CompanyPayload) {
    if (editingCompany) {
      const updated = await updateCompany(editingCompany.id, payload);
      setCompanies((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      showToast("Company updated.");
    } else {
      const created = await createCompany(payload);
      setCompanies((prev) => [...prev, created]);
      showToast("Company added.");
    }
    setIsModalOpen(false);
  }

  async function handleDelete(company: Company) {
    const confirmed = await confirm(`Delete "${company.name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteCompany(company.id);
      setCompanies((prev) => prev.filter((c) => c.id !== company.id));
      showToast("Company deleted.");
    } catch (err) {
      showToast(
        err instanceof ApiError ? err.message : "Failed to delete company. Please try again.",
        "error",
      );
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Companies</h2>
          <button
            onClick={openAddModal}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Add company
          </button>
        </div>

        {isLoading && <p className="text-slate-500">Loading companies...</p>}

        {loadError && <p className="text-sm text-red-600">{loadError}</p>}

        {!isLoading && !loadError && companies.length === 0 && (
          <p className="text-slate-500">No companies yet. Add your first one to get started.</p>
        )}

        {!isLoading && !loadError && companies.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Industry</th>
                  <th className="px-4 py-3 font-medium">Location</th>
                  <th className="px-4 py-3 font-medium">Website</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {companies.map((company) => (
                  <tr key={company.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">{company.name}</td>
                    <td className="px-4 py-3 text-slate-600">{company.industry ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">{company.location ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {company.website ? (
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-slate-900 underline"
                        >
                          {company.website}
                        </a>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(company)}
                          className="text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(company)}
                          className="text-sm font-medium text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      {isModalOpen && (
        <CompanyFormModal
          company={editingCompany}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
