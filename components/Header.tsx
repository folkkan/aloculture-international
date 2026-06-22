import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "./ThemeToggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-ink/5 bg-canvas/80 backdrop-blur-xl backdrop-saturate-150 dark:border-cream/5 dark:bg-canvas-dark/80">
      <div className="shell flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Aloculture Plants" width={40} height={40} className="object-contain" priority />
          <div>
            <span className="font-display text-xl tracking-tight text-ink dark:text-ink-dark">Aloculture</span>
            <span className="ml-2 hidden rounded-full bg-forest/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-eyebrow text-forest sm:inline dark:bg-cream/10 dark:text-cream/70">
              International
            </span>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link href="/#collection" className="hidden text-sm text-ink/70 transition-colors hover:text-forest sm:inline dark:text-cream/70 dark:hover:text-cream">Collection</Link>
          <Link href="/#contact" className="hidden text-sm text-ink/70 transition-colors hover:text-forest sm:inline dark:text-cream/70 dark:hover:text-cream">Contact</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
