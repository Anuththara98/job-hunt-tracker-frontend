import { useCallback, useRef, useState, type ReactNode } from "react";
import { ConfirmContext } from "./confirm-context";

export function ConfirmProvider({ children }: { children: ReactNode }) {
  const [message, setMessage] = useState<string | null>(null);
  const resolveRef = useRef<((result: boolean) => void) | null>(null);

  const confirm = useCallback((msg: string) => {
    setMessage(msg);
    return new Promise<boolean>((resolve) => {
      resolveRef.current = resolve;
    });
  }, []);

  function respond(result: boolean) {
    resolveRef.current?.(result);
    resolveRef.current = null;
    setMessage(null);
  }

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {message !== null && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/40 px-4">
          <div
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-dialog-message"
            className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg"
          >
            <p id="confirm-dialog-message" className="mb-5 text-sm text-slate-700">
              {message}
            </p>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => respond(false)}
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => respond(true)}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}