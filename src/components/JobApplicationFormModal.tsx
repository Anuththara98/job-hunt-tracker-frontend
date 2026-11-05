import { useState, type FormEvent } from "react";
import { ApiError } from "../api/client";
import {
  JOB_APPLICATION_STATUSES,
  WORK_TYPES,
  type JobApplication,
  type JobApplicationPayload,
  type JobApplicationStatus,
  type WorkType,
} from "../types/jobApplication";
import type { Company } from "../types/company";

interface JobApplicationFormModalProps {
  jobApplication: JobApplication | null;
  companies: Company[];
  onClose: () => void;
  onSubmit: (payload: JobApplicationPayload) => Promise<void>;
}

export function JobApplicationFormModal({
  jobApplication,
  companies,
  onClose,
  onSubmit,
}: JobApplicationFormModalProps) {
  const isEditing = jobApplication !== null;

  const [companyId, setCompanyId] = useState(
    jobApplication?.companyId ?? companies[0]?.id ?? 0,
  );
  const [jobTitle, setJobTitle] = useState(jobApplication?.jobTitle ?? "");
  const [jobLink, setJobLink] = useState(jobApplication?.jobLink ?? "");
  const [location, setLocation] = useState(jobApplication?.location ?? "");
  const [workType, setWorkType] = useState<WorkType>(jobApplication?.workType ?? "ONSITE");
  const [status, setStatus] = useState<JobApplicationStatus>(
    jobApplication?.status ?? "APPLIED",
  );
  const [appliedDate, setAppliedDate] = useState(jobApplication?.appliedDate ?? "");
  const [closingDate, setClosingDate] = useState(jobApplication?.closingDate ?? "");
  const [notes, setNotes] = useState(jobApplication?.notes ?? "");
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsSubmitting(true);
    try {
      await onSubmit({
        companyId,
        jobTitle,
        jobLink: jobLink.trim() === "" ? null : jobLink,
        location: location.trim() === "" ? null : location,
        workType,
        status,
        appliedDate: appliedDate === "" ? null : appliedDate,
        closingDate: closingDate === "" ? null : closingDate,
        notes: notes.trim() === "" ? null : notes,
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.validationErrors ?? {});
      } else {
        setError("Something went wrong. Please try again.");
      }
      setIsSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="job-application-form-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      >
        <h2 id="job-application-form-title" className="mb-4 text-lg font-semibold text-slate-900">
          {isEditing ? "Edit job application" : "Add job application"}
        </h2>

        <form onSubmit={handleSubmit} className="max-h-[70vh] space-y-4 overflow-y-auto pr-1">
          <div>
            <label htmlFor="companyId" className="mb-1 block text-sm font-medium text-slate-700">
              Company
            </label>
            <select
              id="companyId"
              required
              value={companyId}
              onChange={(event) => setCompanyId(Number(event.target.value))}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            >
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
            {fieldErrors.companyId && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.companyId}</p>
            )}
          </div>

          <div>
            <label htmlFor="jobTitle" className="mb-1 block text-sm font-medium text-slate-700">
              Job title
            </label>
            <input
              id="jobTitle"
              required
              maxLength={150}
              value={jobTitle}
              onChange={(event) => setJobTitle(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {fieldErrors.jobTitle && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.jobTitle}</p>
            )}
          </div>

          <div>
            <label htmlFor="jobLink" className="mb-1 block text-sm font-medium text-slate-700">
              Job link
            </label>
            <input
              id="jobLink"
              maxLength={500}
              value={jobLink}
              onChange={(event) => setJobLink(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {fieldErrors.jobLink && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.jobLink}</p>
            )}
          </div>

          <div>
            <label htmlFor="location" className="mb-1 block text-sm font-medium text-slate-700">
              Location
            </label>
            <input
              id="location"
              maxLength={100}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {fieldErrors.location && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.location}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="workType" className="mb-1 block text-sm font-medium text-slate-700">
                Work type
              </label>
              <select
                id="workType"
                required
                value={workType}
                onChange={(event) => setWorkType(event.target.value as WorkType)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                {WORK_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
              {fieldErrors.workType && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.workType}</p>
              )}
            </div>

            <div>
              <label htmlFor="status" className="mb-1 block text-sm font-medium text-slate-700">
                Status
              </label>
              <select
                id="status"
                required
                value={status}
                onChange={(event) => setStatus(event.target.value as JobApplicationStatus)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              >
                {JOB_APPLICATION_STATUSES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
              {fieldErrors.status && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.status}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="appliedDate"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Applied date
              </label>
              <input
                id="appliedDate"
                type="date"
                value={appliedDate}
                onChange={(event) => setAppliedDate(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
              {fieldErrors.appliedDate && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.appliedDate}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="closingDate"
                className="mb-1 block text-sm font-medium text-slate-700"
              >
                Closing date
              </label>
              <input
                id="closingDate"
                type="date"
                value={closingDate}
                onChange={(event) => setClosingDate(event.target.value)}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
              />
              {fieldErrors.closingDate && (
                <p className="mt-1 text-xs text-red-600">{fieldErrors.closingDate}</p>
              )}
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="mb-1 block text-sm font-medium text-slate-700">
              Notes
            </label>
            <textarea
              id="notes"
              maxLength={1000}
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {fieldErrors.notes && <p className="mt-1 text-xs text-red-600">{fieldErrors.notes}</p>}
          </div>

          {error && Object.keys(fieldErrors).length === 0 && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add application"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}