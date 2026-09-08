import { getAdminClient } from "@/lib/supabase/admin";
import { AdminHeading, EmptyState } from "@/components/admin/ui";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export const dynamic = "force-dynamic";

export type MediaFile = {
  name: string;
  bucket: "media" | "papers";
  url: string | null;
  size: number | null;
  updatedAt: string | null;
};

async function listBucket(bucket: "media" | "papers"): Promise<MediaFile[]> {
  const db = getAdminClient();
  if (!db) return [];

  const { data, error } = await db.storage
    .from(bucket)
    .list("", { limit: 200, sortBy: { column: "created_at", order: "desc" } });

  if (error || !data) return [];

  return data
    .filter((f) => f.name && f.name !== ".emptyFolderPlaceholder")
    .map((f) => ({
      name: f.name,
      bucket,
      // `papers` is private, so it deliberately has no public URL.
      url: bucket === "media" ? db.storage.from(bucket).getPublicUrl(f.name).data.publicUrl : null,
      size: (f.metadata as { size?: number } | null)?.size ?? null,
      updatedAt: f.updated_at ?? f.created_at ?? null,
    }));
}

export default async function MediaPage() {
  const [media, papers] = await Promise.all([listBucket("media"), listBucket("papers")]);

  return (
    <div className="mx-auto max-w-5xl">
      <AdminHeading eyebrow="Content" title="Files" />
      <p className="mt-5 max-w-xl text-sm leading-relaxed text-ink-soft">
        Images live in <strong>Media</strong> and are publicly readable, which is what lets them
        appear on the site. PDFs live in <strong>Papers</strong> and are private: they have no
        public address, so a restricted paper can only be sent by you, by hand.
      </p>

      <MediaLibrary media={media} papers={papers} />

      {media.length === 0 && papers.length === 0 && (
        <div className="mt-8">
          <EmptyState>No files yet.</EmptyState>
        </div>
      )}
    </div>
  );
}
