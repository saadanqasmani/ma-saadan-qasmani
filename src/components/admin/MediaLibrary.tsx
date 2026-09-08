"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { MediaFile } from "@/app/admin/(dashboard)/media/page";
import { deleteFile } from "@/app/admin/actions";
import { formatDate } from "@/components/admin/ui";

function humanSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Uploader({ bucket, onDone }: { bucket: "media" | "papers"; onDone: () => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const ref = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const body = new FormData();
      body.set("file", file);
      body.set("bucket", bucket);
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) setError(data.error ?? "Upload failed.");
      else onDone();
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        disabled={busy}
        onClick={() => ref.current?.click()}
        className="border border-line px-4 py-2 text-xs uppercase tracking-[0.12em] text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
      >
        {busy ? "Uploading…" : `Upload ${bucket === "papers" ? "a PDF" : "an image"}`}
      </button>
      <input
        ref={ref}
        type="file"
        accept={bucket === "papers" ? ".pdf" : "image/*"}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) upload(file);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-2 text-sm text-ember">{error}</p>}
    </div>
  );
}

function FileRow({ file, onDeleted }: { file: MediaFile; onDeleted: () => void }) {
  const [copied, setCopied] = useState(false);

  return (
    <li className="flex items-center gap-4 border border-line bg-canvas p-3">
      {file.url ? (
        // Admin preview of an arbitrary bucket URL, deliberately unoptimised.
        // eslint-disable-next-line @next/next/no-img-element
        <img src={file.url} alt="" className="h-14 w-14 shrink-0 border border-line object-cover" />
      ) : (
        <span className="grid h-14 w-14 shrink-0 place-items-center border border-line text-[10px] uppercase tracking-[0.1em] text-ink-faint">
          PDF
        </span>
      )}

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm">{file.name}</p>
        <p className="text-xs text-ink-faint">
          {humanSize(file.size)}
          {file.updatedAt ? ` · ${formatDate(file.updatedAt)}` : ""}
          {!file.url ? " · private" : ""}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-3">
        {file.url && (
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(file.url ?? "");
              setCopied(true);
              setTimeout(() => setCopied(false), 1500);
            }}
            className="text-xs uppercase tracking-[0.12em] text-ink-soft hover:text-ink"
          >
            {copied ? "Copied" : "Copy link"}
          </button>
        )}
        <form
          action={async () => {
            await deleteFile(file.bucket, file.name);
            onDeleted();
          }}
        >
          <button
            type="submit"
            className="text-xs uppercase tracking-[0.12em] text-ink-faint hover:text-ember"
          >
            Delete
          </button>
        </form>
      </div>
    </li>
  );
}

export function MediaLibrary({ media, papers }: { media: MediaFile[]; papers: MediaFile[] }) {
  const router = useRouter();
  const refresh = () => router.refresh();

  return (
    <div className="mt-10 space-y-12">
      {(
        [
          { title: "Media", bucket: "media" as const, files: media },
          { title: "Papers", bucket: "papers" as const, files: papers },
        ]
      ).map((group) => (
        <section key={group.bucket}>
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-line pb-4">
            <h2 className="font-display text-2xl">{group.title}</h2>
            <Uploader bucket={group.bucket} onDone={refresh} />
          </div>
          {group.files.length === 0 ? (
            <p className="py-8 text-sm text-ink-faint">Nothing here yet.</p>
          ) : (
            <ul className="mt-5 space-y-2">
              {group.files.map((f) => (
                <FileRow key={`${f.bucket}/${f.name}`} file={f} onDeleted={refresh} />
              ))}
            </ul>
          )}
        </section>
      ))}
    </div>
  );
}
