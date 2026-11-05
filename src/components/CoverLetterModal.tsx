import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ApiError } from "../api/client";
import { AnimatedModal } from "./AnimatedModal";
import { useGenerateCoverLetter } from "../queries/coverLetter";
import {
  coverLetterSchema,
  type CoverLetterFormValues,
} from "../schemas/coverLetter";

interface CoverLetterModalProps {
  jobApplicationId: number;
  jobTitle: string;
  companyName: string;
  onClose: () => void;
}

export function CoverLetterModal({
  jobApplicationId,
  jobTitle,
  companyName,
  onClose,
}: CoverLetterModalProps) {
  const [copied, setCopied] = useState(false);
  const generateMutation = useGenerateCoverLetter(jobApplicationId);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CoverLetterFormValues>({
    resolver: zodResolver(coverLetterSchema),
    defaultValues: { userBio: "" },
  });

  function onGenerate(values: CoverLetterFormValues) {
    generateMutation.mutate({
      userBio: values.userBio.trim() === "" ? null : values.userBio,
    });
  }

  async function handleCopy() {
    if (!generateMutation.data) return;
    await navigator.clipboard.writeText(generateMutation.data.generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const isGenerating = generateMutation.isPending;
  const generatedLetter = generateMutation.data?.generatedLetter ?? null;
  const serverError =
    generateMutation.error instanceof ApiError
      ? generateMutation.error.message
      : generateMutation.isError
        ? "Something went wrong. Please try again."
        : null;

  return (
    <AnimatedModal
      ariaLabelledBy="cover-letter-title"
      maxWidthClassName="max-w-lg"
    >
      <h2
        id="cover-letter-title"
        className="mb-1 text-lg font-semibold text-slate-900"
      >
        Generate cover letter
      </h2>
      <p className="mb-4 text-sm text-slate-500">
        {jobTitle} at {companyName}
      </p>

      {!generatedLetter && (
        <form onSubmit={handleSubmit(onGenerate)} className="space-y-4">
          <div>
            <label
              htmlFor="userBio"
              className="mb-1 block text-sm font-medium text-slate-700"
            >
              A little about you (optional)
            </label>
            <textarea
              id="userBio"
              rows={4}
              {...register("userBio")}
              placeholder="e.g. 4+ years backend experience with Java/Spring Boot..."
              disabled={isGenerating}
              className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none disabled:opacity-50"
            />
            {errors.userBio && (
              <p className="mt-1 text-xs text-red-600">
                {errors.userBio.message}
              </p>
            )}
          </div>

          {serverError && (
            <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {serverError}
            </p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isGenerating}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isGenerating}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
            >
              {isGenerating ? "Generating..." : "Generate"}
            </button>
          </div>
        </form>
      )}

      {generatedLetter && (
        <div className="space-y-4">
          <pre className="max-h-96 overflow-y-auto whitespace-pre-wrap rounded-md border border-slate-200 bg-slate-50 p-4 text-sm text-slate-800">
            {generatedLetter}
          </pre>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
            >
              {copied ? "Copied!" : "Copy to clipboard"}
            </button>
          </div>
        </div>
      )}
    </AnimatedModal>
  );
}
