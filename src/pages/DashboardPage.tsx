import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { AppHeader } from "../components/AppHeader";
import { ApiError } from "../api/client";
import { useCompanies } from "../queries/companies";
import { useJobApplications } from "../queries/jobApplications";
import {
  JOB_APPLICATION_STATUSES,
  type JobApplicationStatus,
} from "../types/jobApplication";

const STATUS_TILE_STYLES: Record<JobApplicationStatus, string> = {
  APPLIED: "bg-blue-50 text-blue-700",
  INTERVIEW: "bg-amber-50 text-amber-700",
  OFFER: "bg-green-50 text-green-700",
  REJECTED: "bg-red-50 text-red-700",
};

const CLOSING_SOON_WINDOW_DAYS = 7;

function daysUntil(dateStr: string): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${dateStr}T00:00:00`);
  return Math.round(
    (target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export function DashboardPage() {
  const { user } = useAuth();
  const {
    data: jobApplications,
    isLoading: isLoadingJobApplications,
    isError: isJobApplicationsError,
    error: jobApplicationsError,
  } = useJobApplications();
  const { data: companies, isLoading: isLoadingCompanies } = useCompanies();

  const isLoading = isLoadingJobApplications || isLoadingCompanies;

  const statusCounts = useMemo(() => {
    const counts: Record<JobApplicationStatus, number> = {
      APPLIED: 0,
      INTERVIEW: 0,
      OFFER: 0,
      REJECTED: 0,
    };
    for (const jobApplication of jobApplications ?? []) {
      counts[jobApplication.status] += 1;
    }
    return counts;
  }, [jobApplications]);

  const closingSoon = useMemo(() => {
    return (jobApplications ?? [])
      .filter((j) => j.closingDate !== null && j.status !== "REJECTED")
      .map((j) => ({ jobApplication: j, daysLeft: daysUntil(j.closingDate!) }))
      .filter(
        ({ daysLeft }) => daysLeft >= 0 && daysLeft <= CLOSING_SOON_WINDOW_DAYS,
      )
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [jobApplications]);

  return (
    <div className="min-h-screen bg-slate-50">
      <AppHeader />

      <main className="px-6 py-8">
        <p className="mb-6 text-slate-600">Welcome back, {user?.firstName}.</p>

        {isLoading && <p className="text-slate-500">Loading dashboard...</p>}
        {isJobApplicationsError && (
          <p className="text-sm text-red-600">
            {jobApplicationsError instanceof ApiError
              ? jobApplicationsError.message
              : "Failed to load dashboard data."}
          </p>
        )}

        {!isLoading && !isJobApplicationsError && (
          <>
            <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">Companies</p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {companies?.length ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-xs font-medium text-slate-500">
                  Applications
                </p>
                <p className="mt-1 text-2xl font-semibold text-slate-900">
                  {jobApplications?.length ?? 0}
                </p>
              </div>
              {JOB_APPLICATION_STATUSES.map((status) => (
                <div
                  key={status}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <p className="text-xs font-medium text-slate-500">{status}</p>
                  <p
                    className={`mt-1 inline-block rounded-full px-2 py-0.5 text-2xl font-semibold ${STATUS_TILE_STYLES[status]}`}
                  >
                    {statusCounts[status]}
                  </p>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-5">
              <h3 className="mb-3 text-sm font-semibold text-slate-900">
                Closing within {CLOSING_SOON_WINDOW_DAYS} days
              </h3>

              {(jobApplications?.length ?? 0) === 0 ? (
                <p className="text-sm text-slate-500">
                  No job applications yet.{" "}
                  <Link
                    to="/job-applications"
                    className="font-medium text-slate-900 underline"
                  >
                    Add one
                  </Link>
                  .
                </p>
              ) : closingSoon.length === 0 ? (
                <p className="text-sm text-slate-500">
                  Nothing closing soon. You're all caught up.
                </p>
              ) : (
                <ul className="divide-y divide-slate-100">
                  {closingSoon.map(({ jobApplication, daysLeft }) => (
                    <li
                      key={jobApplication.id}
                      className="flex items-center justify-between py-2 text-sm"
                    >
                      <span className="text-slate-800">
                        {jobApplication.jobTitle} at{" "}
                        {jobApplication.companyName}
                      </span>
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          daysLeft <= 2
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-700"
                        }`}
                      >
                        {daysLeft === 0 ? "Closes today" : `${daysLeft}d left`}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
