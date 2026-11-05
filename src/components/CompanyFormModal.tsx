import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "../api/client";
import { AnimatedModal } from "./AnimatedModal";
import { companySchema, type CompanyFormValues } from "../schemas/company";
import type { Company, CompanyPayload } from "../types/company";

interface CompanyFormModalProps {
  company: Company | null;
  onClose: () => void;
  onSubmit: (payload: CompanyPayload) => Promise<void>;
}

export function CompanyFormModal({
  company,
  onClose,
  onSubmit,
}: CompanyFormModalProps) {
  const isEditing = company !== null;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<CompanyFormValues>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: company?.name ?? "",
      industry: company?.industry ?? "",
      website: company?.website ?? "",
      location: company?.location ?? "",
      notes: company?.notes ?? "",
    },
  });

  async function submit(values: CompanyFormValues) {
    try {
      await onSubmit({
        name: values.name,
        industry: values.industry.trim() === "" ? null : values.industry,
        website: values.website.trim() === "" ? null : values.website,
        location: values.location.trim() === "" ? null : values.location,
        notes: values.notes.trim() === "" ? null : values.notes,
      });
    } catch (err) {
      if (err instanceof ApiError && err.validationErrors) {
        for (const [field, message] of Object.entries(err.validationErrors)) {
          setError(field as keyof CompanyFormValues, { message });
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
    <AnimatedModal ariaLabelledBy="company-form-title">
      <h2
        id="company-form-title"
        className="mb-4 text-lg font-semibold text-slate-900"
      >
        {isEditing ? "Edit company" : "Add company"}
      </h2>

      <form onSubmit={handleSubmit(submit)} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Company name
          </label>
          <input
            id="name"
            {...register("name")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          {errors.name && (
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="industry"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Industry
          </label>
          <input
            id="industry"
            {...register("industry")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          {errors.industry && (
            <p className="mt-1 text-xs text-red-600">
              {errors.industry.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="website"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Website
          </label>
          <input
            id="website"
            {...register("website")}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
          />
          {errors.website && (
            <p className="mt-1 text-xs text-red-600">
              {errors.website.message}
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
                : "Add company"}
          </button>
        </div>
      </form>
    </AnimatedModal>
  );
}
