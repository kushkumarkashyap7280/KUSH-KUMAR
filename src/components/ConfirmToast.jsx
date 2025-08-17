import React from "react";
import { toast } from "sonner";

export function confirmToast({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
}) {
  return new Promise((resolve) => {
    const id = toast.custom(
      () => (
        <div className="w-[320px] rounded-lg border border-white/10 bg-slate-900/90 p-4 text-sm text-white/90 shadow-xl backdrop-blur">
          <div className="mb-2 font-medium">{title}</div>
          {description ? (
            <div className="mb-3 text-xs text-white/70">{description}</div>
          ) : null}
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(false);
              }}
              className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/10 px-3 py-1.5 text-xs hover:bg-white/15"
            >
              {cancelText}
            </button>
            <button
              onClick={() => {
                toast.dismiss(id);
                resolve(true);
              }}
              className="inline-flex items-center gap-2 rounded-md border border-red-400/30 bg-red-500/20 px-3 py-1.5 text-xs text-red-200 hover:bg-red-500/25"
            >
              {confirmText}
            </button>
          </div>
        </div>
      ),
      { duration: Infinity }
    );
  });
}
