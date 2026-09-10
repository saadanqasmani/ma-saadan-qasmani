import Image from "next/image";
import { cn } from "@/lib/utils";

/**
 * The novel, standing at an angle rather than lying flat on the page.
 *
 * Built from the cover art alone: the front face is the artwork, the spine
 * and the page block are drawn, and the whole thing is turned a little so
 * both come into view. A photograph of a physical copy would be better, and
 * there is no physical copy yet.
 *
 * The turn is fixed rather than following a pointer. A book that swivels to
 * follow the mouse is a toy; this one is a jacket standing on a shelf, and
 * it should read the same on a phone, where there is no pointer at all.
 */
export function BookCover3D({
  src,
  alt,
  className,
  priority = false,
  sizes = "(min-width: 1024px) 22rem, 60vw",
}: {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <div className={cn("book3d", className)}>
      <div className="book3d__body">
        {/* Drawn, not photographed. Both are decoration: the cover carries
            the alt text, and a screen reader has no use for an edge. */}
        <span className="book3d__spine" aria-hidden />
        <span className="book3d__pages" aria-hidden />

        <div className="book3d__front">
          <Image
            src={src}
            alt={alt}
            width={529}
            height={830}
            sizes={sizes}
            priority={priority}
            className="block h-full w-full object-cover"
          />
          {/* Light falls across a turned jacket. Without this the front
              face stays perfectly flat and the whole thing reads as a
              rectangle that happens to be skewed. */}
          <span className="book3d__sheen" aria-hidden />
        </div>
      </div>

      <span className="book3d__shadow" aria-hidden />
    </div>
  );
}
