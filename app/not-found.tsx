import Link from "next/link";

export default function NotFound() {
  return (
    <div className="shell flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="eyebrow">404</p>
      <h1 className="mt-4 font-display text-4xl font-light text-ink dark:text-ink-dark">
        This specimen has found a new home.
      </h1>
      <Link
        href="/"
        className="mt-8 rounded-full bg-forest px-7 py-3 text-sm text-cream transition-colors hover:bg-ink dark:bg-cream dark:text-ink"
      >
        Return to the collection
      </Link>
    </div>
  );
}
