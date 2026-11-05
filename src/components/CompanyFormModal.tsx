import { useState, type FormEvent } from "react";
import { ApiError } from "../api/client";
import type { Company, CompanyPayload } from "../types/company";

interface CompanyFormModalProps {
  company: Company | null;
  onClose: () => void;
  onSubmit: (payload: CompanyPayload) => Promise<void>;
}

export function CompanyFormModal({ company, onClose, onSubmit }: CompanyFormModalProps) {
  const isEditing = company !== null;

  const [name, setName] = useState(company?.name ?? "");
  const [industry, setIndustry] = useState(company?.industry ?? "");
  const [website, setWebsite] = useState(company?.website ?? "");
  const [location, setLocation] = useState(company?.location ?? "");
  const [notes, setNotes] = useState(company?.notes ?? "");
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
        name,
        industry: industry.trim() === "" ? null : industry,
        website: website.trim() === "" ? null : website,
        location: location.trim() === "" ? null : location,
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
        aria-labelledby="company-form-title"
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-lg"
      >
        <h2 id="company-form-title" className="mb-4 text-lg font-semibold text-slate-900">
          {isEditing ? "Edit company" : "Add company"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-slate-700">
              Company name
            </label>
            <input
              id="name"
              required
              maxLength={100}
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {fieldErrors.name && <p className="mt-1 text-xs text-red-600">{fieldErrors.name}</p>}
          </div>

          <div>
            <label htmlFor="industry" className="mb-1 block text-sm font-medium text-slate-700">
              Industry
            </label>
            <input
              id="industry"
              maxLength={100}
              value={industry}
              onChange={(event) => setIndustry(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {fieldErrors.industry && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.industry}</p>
            )}
          </div>

          <div>
            <label htmlFor="website" className="mb-1 block text-sm font-medium text-slate-700">
              Website
            </label>
            <input
              id="website"
              maxLength={255}
              value={website}
              onChange={(event) => setWebsite(event.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none"
            />
            {fieldErrors.website && (
              <p className="mt-1 text-xs text-red-600">{fieldErrors.website}</p>
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
              {isSubmitting ? "Saving..." : isEditing ? "Save changes" : "Add company"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}