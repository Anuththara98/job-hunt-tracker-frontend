import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { JobApplicationFormModal } from "../components/JobApplicationFormModal";
import { ApiError } from "../api/client";
import { listCompanies } from "../api/companies";
import {
  createJobApplication,
  deleteJobApplication,
  listJobApplications,
  updateJobApplication,
} from "../api/jobApplications";
import type { Company } from "../types/company";
import type {
  JobApplication,
  JobApplicationPayload,
  JobApplicationStatus,
} from "../types/jobApplication";

const STATUS_STYLES: Record<JobApplicationStatus, string> = {
  APPLIED: "bg-blue-50 text-blue-700",
  INTERVIEW: "bg-amber-50 text-amber-700",
  OFFER: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

export function JobApplicationsPage() {
  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [editingJobApplication, setEditingJobApplication] = useState<JobApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    setIsLoading(true);
    setLoadError(null);
    try {
      const [jobApplicationsData, companiesData] = await Promise.all([
        listJobApplications(),
        listCompanies(),
      ]);
      setJobApplications(jobApplicationsData);
      setCompanies(companiesData);
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Failed to load job applications.");
    } finally {
      setIsLoading(false);
    }
  }

  function openAddModal() {
    setEditingJobApplication(null);
    setActionError(null);
    setIsModalOpen(true);
  }

  function openEditModal(jobApplication: JobApplication) {
    setEditingJobApplication(jobApplication);
    setActionError(null);
    setIsModalOpen(true);
  }

  async function handleFormSubmit(payload: JobApplicationPayload) {
    if (editingJobApplication) {
      const updated = await updateJobApplication(editingJobApplication.id, payload);
      setJobApplications((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
    } else {
      const created = await createJobApplication(payload);
      setJobApplications((prev) => [...prev, created]);
    }
    setIsModalOpen(false);
  }

  async function handleDelete(jobApplication: JobApplication) {
    const confirmed = window.confirm(
      `Delete the application for "${jobApplication.jobTitle}" at ${jobApplication.companyName}? This cannot be undone.`,
    );
    if (!confirmed) return;

    setActionError(null);
    try {
      await deleteJobApplication(jobApplication.id);
      setJobApplications((prev) => prev.filter((j) => j.id !== jobApplication.id));
    } catch (err) {
      setActionError(
        err instanceof ApiError
          ? err.message
          : "Failed to delete job application. Please try again.",
      );
    }
  }

  const hasCompanies = companies.length > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">Job Applications</h2>
          <button
            onClick={openAddModal}
            disabled={!hasCompanies}
            title={hasCompanies ? undefined : "Add a company first"}
            className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add application
          </button>
        </div>

        {!isLoading && !loadError && !hasCompanies && (
          <p className="mb-4 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            You need at least one company before adding a job application.{" "}
            <Link to="/companies" className="font-medium text-slate-900 underline">
              Add a company
            </Link>
            .
          </p>
        )}

        {actionError && (
          <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
            {actionError}
          </p>
        )}

        {isLoading && <p className="text-slate-500">Loading job applications...</p>}

        {loadError && <p className="text-sm text-red-600">{loadError}</p>}

        {!isLoading && !loadError && jobApplications.length === 0 && hasCompanies && (
          <p className="text-slate-500">No job applications yet. Add your first one to get started.</p>
        )}

        {!isLoading && !loadError && jobApplications.length > 0 && (
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-3 font-medium">Job title</th>
                  <th className="px-4 py-3 font-medium">Company</th>
                  <th className="px-4 py-3 font-medium">Work type</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Applied</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobApplications.map((jobApplication) => (
                  <tr key={jobApplication.id} className="border-b border-slate-100 last:border-0">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {jobApplication.jobLink ? (
                        <a
                          href={jobApplication.jobLink}
                          target="_blank"
                          rel="noreferrer"
                          className="underline"
                        >
                          {jobApplication.jobTitle}
                        </a>
                      ) : (
                        jobApplication.jobTitle
                      )}
                    </td>
                    <td className="px-4 py-3 text-slate-600">{jobApplication.companyName}</td>
                    <td className="px-4 py-3 text-slate-600">{jobApplication.workType}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[jobApplication.status]}`}
                      >
                        {jobApplication.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {jobApplication.appliedDate ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          onClick={() => openEditModal(jobApplication)}
                          className="text-sm font-medium text-slate-700 hover:text-slate-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(jobApplication)}
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
        <JobApplicationFormModal
          jobApplication={editingJobApplication}
          companies={companies}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}