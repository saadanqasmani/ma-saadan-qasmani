"use client";

import { useRef, useState } from "react";

/**
 * Upload-and-set-a-value control.
 *
 * Uploads through an API route rather than a nested form, because a form
 * cannot legally contain another form. The chosen value travels with the
 * parent form in a hidden input.
 */
export function FilePicker({
  name,
  bucket,
  defaultValue,
}: {
  name: string;
  bucket: "media" | "papers";
  defaultValue: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("bucket", bucket);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Upload failed.");
        return;
      }
      setValue(data.value);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  const isImage = /\.(png|jpe?g|webp|avif|gif|svg)$/i.test(value);

  return (
    <div>
      <input type="hidden" name={name} value={value} />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => inputRef.current?.click()}
          className="t-label border border-line px-4 py-2 text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
        >
          {busy ? "Uploading…" : value ? "Replace file" : "Upload file"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => setValue("")}
            className="t-label text-ink-faint underline-offset-4 hover:text-ember hover:underline"
          >
            Remove
          </button>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={bucket === "papers" ? ".pdf" : "image/*"}
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) upload(file);
            e.target.value = "";
          }}
        />
      </div>

      {error && <p className="mt-2 text-sm text-ember">{error}</p>}

      {value && (
        <div className="mt-3">
          {isImage ? (
            // Deliberately a plain img: the source is an arbitrary bucket URL,
            // and this is a private admin preview, not a public page.
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={value}
              alt="Selected file"
              className="max-h-44 border border-line object-contain"
            />
          ) : (
            <p className="break-all border border-line bg-canvas-light px-3 py-2 text-xs text-ink-soft">
              {value}
              {bucket === "papers" && (
                <span className="mt-1 block text-ink-faint">
                  Private. Not reachable from the public site.
                </span>
              )}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
