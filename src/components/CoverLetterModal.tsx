import { useState } from "react";
import { ApiError } from "../api/client";
import { generateCoverLetter } from "../api/coverLetter";

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
  const [userBio, setUserBio] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleGenerate() {
    setIsGenerating(true);
    setError(null);
    try {
      const response = await generateCoverLetter(jobApplicationId, {
        userBio: userBio.trim() === "" ? null : userBio,
      });
      setGeneratedLetter(response.generatedLetter);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleCopy() {
    if (!generatedLetter) return;
    await navigator.clipboard.writeText(generatedLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cover-letter-title"
        className="w-full max-w-lg rounded-xl bg-white p-6 shadow-lg"
      >
        <h2 id="cover-letter-title" className="mb-1 text-lg font-semibold text-slate-900">
          Generate cover letter
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          {jobTitle} at {companyName}
        </p>

        {!generatedLetter && (
          <div className="space-y-4">
            <div>
              <label htmlFor="userBio" className="mb-1 block text-sm font-medium text-slate-700">
                A little about you (optional)
              </label>
              <textarea
                id="userBio"
                maxLength={500}
                rows={4}
                value={userBio}
                onChange={(event) => setUserBio(event.target.value)}
                placeholder="e.g. 4+ years backend experience with Java/Spring Boot..."
                disabled={isGenerating}
                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:outline-none disabled:opacity-50"
              />
            </div>

            {error && (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
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
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {isGenerating ? "Generating..." : "Generate"}
              </button>
            </div>
          </div>
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
      </div>
    </div>
  );
}