import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "../api/client";
import { AnimatedModal } from "./AnimatedModal";
import {
  jobApplicationSchema,
  type JobApplicationFormValues,
} from "../schemas/jobApplication";
import {
  JOB_APPLICATION_STATUSES,
  WORK_TYPES,
  type JobApplication,
  type JobApplicationPayload,
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

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<JobApplicationFormValues>({
    resolver: zodResolver(jobApplicationSchema),
    defaultValues: {
      companyId: String(jobApplication?.companyId ?? companies[0]?.id ?? ""),
      jobTitle: jobApplication?.jobTitle ?? "",
      jobLink: jobApplication?.jobLink ?? "",
      location: jobApplication?.location ?? "",
      workType: jobApplication?.workType ?? "ONSITE",
      status: jobApplication?.status ?? "APPLIED",
      appliedDate: jobApplication?.appliedDate ?? "",
      closingDate: jobApplication?.closingDate ?? "",
      notes: jobApplication?.notes ?? "",
    },
  });

  async function submit(values: JobApplicationFormValues) {
    try {
      await onSubmit({
        companyId: Number(values.companyId),
        jobTitle: values.jobTitle,
        jobLink: values.jobLink.trim() === "" ? null : values.jobLink,
        location: values.location.trim() === "" ? null : values.location,
        workType: values.workType,
        status: values.status,
        appliedDate: values.appliedDate === "" ? null : values.appliedDate,
        closingDate: values.closingDate === "" ? null : values.closingDate,
        notes: values.notes.trim() === "" ? null : values.notes,
      });
    } catch (err) {
      if (err instanceof ApiError && err.validationErrors) {
        for (const [field, message] of Object.entries(err.validationErrors)) {
          setError(field as keyof JobApplicationFormValues, { message });
        }
      } else {
        setError("root", {
          message:
            err instanceof ApiError
              ? err.message
              : "Something went wrong. Please try again.",
        });
      }
    }
  }

  return (
    <AnimatedModal ariaLabelledBy="job-application-form-title">
      <h2
        id="job-application-form-title"
        className="mb-4 text-lg font-semibold text-slate-900"
      >
        {isEditing ? "Edit job application" : "Add job application"}
      </h2>

      <form
        onSubmit={handleSubmit(submit)}
        className="max-h-[70vh] space-y-4 overflow-y-auto pr-1"
      >
        <div>
          <label
            htmlFor="companyId"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Company
          </label>
          <select
            id="companyId"
            {...register("companyId")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          >
            {companies.map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
          {errors.companyId && (
            <p className="mt-1 text-xs text-red-600">
              {errors.companyId.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="jobTitle"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Job title
          </label>
          <input
            id="jobTitle"
            {...register("jobTitle")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          {errors.jobTitle && (
            <p className="mt-1 text-xs text-red-600">
              {errors.jobTitle.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="jobLink"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Job link
          </label>
          <input
            id="jobLink"
            {...register("jobLink")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          {errors.jobLink && (
            <p className="mt-1 text-xs text-red-600">
              {errors.jobLink.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="location"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Location
          </label>
          <input
            id="location"
            {...register("location")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          {errors.location && (
            <p className="mt-1 text-xs text-red-600">
              {errors.location.message}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label
              htmlFor="workType"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Work type
            </label>
            <select
              id="workType"
              {...register("workType")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            >
              {WORK_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {errors.workType && (
              <p className="mt-1 text-xs text-red-600">
                {errors.workType.message}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="status"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              Status
            </label>
            <select
              id="status"
              {...register("status")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            >
              {JOB_APPLICATION_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && (
              <p className="mt-1 text-xs text-red-600">
                {errors.status.message}
              </p>
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
              {...register("appliedDate")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {errors.appliedDate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.appliedDate.message}
              </p>
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
              {...register("closingDate")}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {errors.closingDate && (
              <p className="mt-1 text-xs text-red-600">
                {errors.closingDate.message}
              </p>
            )}
          </div>
        </div>

        <div>
          <label
            htmlFor="notes"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Notes
          </label>
          <textarea
            id="notes"
            rows={3}
            {...register("notes")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          {errors.notes && (
            <p className="mt-1 text-xs text-red-600">{errors.notes.message}</p>
          )}
        </div>

        {errors.root && (
          <p className="text-sm text-red-600">{errors.root.message}</p>
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
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Add application"}
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}
