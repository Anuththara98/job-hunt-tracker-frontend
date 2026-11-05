import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AppHeader } from "../components/AppHeader";
import { JobApplicationFormModal } from "../components/JobApplicationFormModal";
import { CoverLetterModal } from "../components/CoverLetterModal";
import { ApiError } from "../api/client";
import { listCompanies } from "../api/companies";
import {
  createJobApplication,
  deleteJobApplication,
  listJobApplications,
  updateJobApplication,
} from "../api/jobApplications";
import { useToast } from "../context/useToast";
import { useConfirm } from "../context/useConfirm";
import type { Company } from "../types/company";
import {
  JOB_APPLICATION_STATUSES,
  type JobApplication,
  type JobApplicationPayload,
  type JobApplicationStatus,
} from "../types/jobApplication";

const STATUS_STYLES: Record<JobApplicationStatus, string> = {
  APPLIED: "bg-blue-50 text-blue-700",
  INTERVIEW: "bg-amber-50 text-amber-700",
  OFFER: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

type StatusFilter = JobApplicationStatus | "ALL";

export function JobApplicationsPage() {
  const { showToast } = useToast();
  const { confirm } = useConfirm();

  const [jobApplications, setJobApplications] = useState<JobApplication[]>([]);
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingJobApplication, setEditingJobApplication] = useState<JobApplication | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [coverLetterTarget, setCoverLetterTarget] = useState<JobApplication | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

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
    setIsModalOpen(true);
  }

  function openEditModal(jobApplication: JobApplication) {
    setEditingJobApplication(jobApplication);
    setIsModalOpen(true);
  }

  async function handleFormSubmit(payload: JobApplicationPayload) {
    if (editingJobApplication) {
      const updated = await updateJobApplication(editingJobApplication.id, payload);
      setJobApplications((prev) => prev.map((j) => (j.id === updated.id ? updated : j)));
      showToast("Job application updated.");
    } else {
      const created = await createJobApplication(payload);
      setJobApplications((prev) => [...prev, created]);
      showToast("Job application added.");
    }
    setIsModalOpen(false);
  }

  async function handleDelete(jobApplication: JobApplication) {
    const confirmed = await confirm(
      `Delete the application for "${jobApplication.jobTitle}" at ${jobApplication.companyName}? This cannot be undone.`,
    );
    if (!confirmed) return;

    try {
      await deleteJobApplication(jobApplication.id);
      setJobApplications((prev) => prev.filter((j) => j.id !== jobApplication.id));
      showToast("Job application deleted.");
    } catch (err) {
      showToast(
        err instanceof ApiError
          ? err.message
          : "Failed to delete job application. Please try again.",
        "error",
      );
    }
  }

  const hasCompanies = companies.length > 0;

  const filteredJobApplications = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return jobApplications.filter((jobApplication) => {
      const matchesStatus = statusFilter === "ALL" || jobApplication.status === statusFilter;
      const matchesQuery =
        query === "" ||
        jobApplication.jobTitle.toLowerCase().includes(query) ||
        jobApplication.companyName.toLowerCase().includes(query);
      return matchesStatus && matchesQuery;
    });
  }, [jobApplications, statusFilter, searchQuery]);

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

        {isLoading && <p className="text-slate-500">Loading job applications...</p>}

        {loadError && <p className="text-sm text-red-600">{loadError}</p>}

        {!isLoading && !loadError && jobApplications.length === 0 && hasCompanies && (
          <p className="text-slate-500">No job applications yet. Add your first one to get started.</p>
        )}

        {!isLoading && !loadError && jobApplications.length > 0 && (
          <>
            <div className="mb-4 flex flex-wrap gap-3">
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by job title or company..."
                className="w-full max-w-xs rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as StatusFilter)}
                className="rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                <option value="ALL">All statuses</option>
                {JOB_APPLICATION_STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {filteredJobApplications.length === 0 ? (
              <p className="text-slate-500">No job applications match your filters.</p>
            ) : (
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
                    {filteredJobApplications.map((jobApplication) => (
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
                              onClick={() => setCoverLetterTarget(jobApplication)}
                              className="text-sm font-medium text-slate-700 hover:text-slate-900"
                            >
                              Cover letter
                            </button>
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
          </>
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

      {coverLetterTarget && (
        <CoverLetterModal
          jobApplicationId={coverLetterTarget.id}
          jobTitle={coverLetterTarget.jobTitle}
          companyName={coverLetterTarget.companyName}
          onClose={() => setCoverLetterTarget(null)}
        />
      )}
    </div>
  );
}
