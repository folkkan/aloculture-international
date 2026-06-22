"use client";
import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Plant } from "@/lib/types";

export function SearchBar({ plants }: { plants: Plant[] }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = query.trim().length < 1 ? [] : plants.filter((p) => {
    const q = query.toLowerCase();
    return p.name.toLowerCase().includes(q) || (p.variety?.toLowerCase().includes(q)) || (p.group?.toLowerCase().includes(q));
  }).slice(0, 8);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const goTo = useCallback((plant: Plant) => {
    setQuery(plant.name); setOpen(false); router.push(`/plants/${plant.id}`);
  }, [router]);

  function handleKey(e: React.KeyboardEvent) {
    if (!open || results.length === 0) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlighted(h => Math.min(h + 1, results.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlighted(h => Math.max(h - 1, 0)); }
    else if (e.key === "Enter" && highlighted >= 0) { e.preventDefault(); goTo(results[highlighted]); }
    else if (e.key === "Escape") setOpen(false);
  }

  function highlight(text: string, q: string) {
    if (!q) return <>{text}</>;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return <>{text}</>;
    return <>{text.slice(0, idx)}<mark className="bg-forest/20 text-forest dark:bg-cream/20 dark:text-cream">{text.slice(idx, idx + q.length)}</mark>{text.slice(idx + q.length)}</>;
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl mx-auto">
      <div className="relative">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-moss dark:text-cream/40" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input ref={inputRef} type="search" value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setHighlighted(-1); }}
          onFocus={() => query && setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Search plants..."
          className="w-full rounded-full border border-ink/15 bg-canvas py-3 pl-11 pr-5 text-sm text-ink placeholder:text-moss/60 outline-none transition-all focus:border-forest/50 focus:ring-2 focus:ring-forest/10 dark:border-cream/15 dark:bg-surface-dark dark:text-ink-dark dark:placeholder:text-cream/40"
        />
        {query && <button type="button" onClick={() => { setQuery(""); setOpen(false); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-moss hover:text-ink"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg></button>}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-ink/10 bg-canvas shadow-2xl dark:border-cream/10 dark:bg-surface-dark">
          {results.map((plant, i) => (
            <button key={plant.id} type="button" onMouseEnter={() => setHighlighted(i)} onClick={() => goTo(plant)}
              className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${i === highlighted ? "bg-forest/8 dark:bg-cream/8" : "hover:bg-ink/4"} ${i !== 0 ? "border-t border-ink/5 dark:border-cream/5" : ""}`}>
              {plant.images[0] && <img src={plant.images[0].thumbUrl ?? plant.images[0].url} alt="" className="h-10 w-10 flex-shrink-0 rounded-lg object-cover"/>}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink dark:text-ink-dark">{highlight(plant.name, query)}</p>
                {plant.variety && <p className="truncate text-xs italic text-moss dark:text-cream/50">{plant.variety}</p>}
              </div>
              {plant.price !== undefined && <p className="flex-shrink-0 text-xs tabular-nums text-moss">฿{plant.price.toLocaleString()}</p>}
            </button>
          ))}
        </div>
      )}
      {open && query.trim().length > 0 && results.length === 0 && (
        <div className="absolute z-50 mt-2 w-full rounded-2xl border border-ink/10 bg-canvas px-4 py-5 text-center text-sm text-moss shadow-xl dark:border-cream/10 dark:bg-surface-dark">
          No results for "{query}"
        </div>
      )}
    </div>
  );
}
