"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Plant } from "@/lib/types";
import { formatPrice } from "@/lib/format";

export function ProductCard({
  plant,
  index,
  priority,
}: {
  plant: Plant;
  index: number;
  priority?: boolean;
}) {
  const [imgIndex, setImgIndex] = useState(0);
  const hasMultiple = plant.images.length > 1;

  function next() {
    if (hasMultiple) setImgIndex((i) => (i + 1) % plant.images.length);
  }
  function reset() {
    setImgIndex(0);
  }

  const current = plant.images[imgIndex];

  return (
    <Link
      href={`/plants/${plant.id}`}
      className="group block"
      aria-label={plant.name}
    >
      <figure
        className="relative aspect-[4/5] overflow-hidden rounded-[3px] bg-cream/30 dark:bg-surface-dark"
        onMouseEnter={next}
        onMouseLeave={reset}
        onTouchStart={next}
      >
        {current ? (
          <Image
            src={current.url}
            alt={plant.name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-all duration-700 ease-smooth group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-display text-sm italic text-moss dark:text-cream/40">
              no photo
            </span>
          </div>
        )}

        {/* specimen number */}
        <span className="absolute left-3 top-3 font-sans text-[10px] tracking-eyebrow text-white/60 mix-blend-screen">
          {String(index + 1).padStart(3, "0")}
        </span>

        {/* dot indicators เมื่อมีหลายรูป */}
        {hasMultiple && (
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {plant.images.map((_, i) => (
              <span
                key={i}
                className={`block h-1 w-1 rounded-full transition-all duration-300 ${
                  i === imgIndex ? "w-3 bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        )}
      </figure>

      <div className="mt-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="font-display text-lg leading-tight text-ink dark:text-ink-dark">
            {plant.name}
          </h3>
          {plant.variety && (
            <p className="mt-0.5 truncate text-xs italic text-moss dark:text-cream/50">
              {plant.variety}
            </p>
          )}
        </div>
        <p className="shrink-0 font-sans text-sm tabular-nums text-ink/80 dark:text-cream/80">
          {formatPrice(plant.price, plant.currency)}
        </p>
      </div>
    </Link>
  );
}
