import Link from "next/link";

export default function EmptyState({
  title,
  body,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="mx-5 mt-4 rounded-lg border border-dashed border-hairline bg-paper/60 px-5 py-8 text-center">
      <p className="font-serif text-lg text-ink mb-1">{title}</p>
      <p className="text-sm text-inkmuted mb-4 leading-relaxed">{body}</p>
      {ctaLabel && ctaHref && (
        <Link
          href={ctaHref}
          className="inline-block bg-clay text-paper text-sm font-medium px-4 py-2 rounded-md active:bg-clayDeep"
        >
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}
