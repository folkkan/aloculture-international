"use client";

import Image from "next/image";
import { useState } from "react";
import type { PlantImage as PlantImageType } from "@/lib/types";

interface Props {
  image?: PlantImageType;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}

export function PlantImage({ image, alt, sizes, priority, className }: Props) {
  const [errored, setErrored] = useState(false);

  if (!image?.url || errored) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-cream/40 dark:bg-surface-dark">
        <span className="font-display text-sm italic text-moss dark:text-cream/40">
          image unavailable
        </span>
      </div>
    );
  }

  return (
    <Image
      src={image.url}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      onError={() => setErrored(true)}
      className={className}
    />
  );
}
