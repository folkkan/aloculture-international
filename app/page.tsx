import Image from "next/image";
import Link from "next/link";
import<div className="mt-6 flex items-center gap-7">
            <Link href="#collection" className="rounded-full bg-forest px-7 py-3 text-sm text-cream transition-colors duration-300 ease-smooth hover:bg-ink dark:bg-cream dark:text-ink dark:hover:bg-white">
              View collection
            </Link>
            <Link href="#contact" className="text-sm text-ink/70 underline-offset-4 transition-colors hover:text-forest hover:underline dark:text-cream/70 dark:hover:text-cream">
              Enquire now →
            </Link>
          </div>
        </div>

        {hero && (
          <div className="animate-fade-up [animation-delay:120ms]">
            <Link href={`/plants/${hero.id}`} className="group relative block aspect-[4/5] overflow-hidden rounded-[4px] bg-cream/30 dark:bg-surface-dark">
              <PlantImage image={hero.images[0]} alt={hero.name} priority sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-[1.4s] ease-smooth group-hover:scale-[1.05]" />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <p className="text-[10px] uppercase tracking-eyebrow text-cream/80">Featured specimen</p>
                <p className="mt-1 font-display text-2xl text-cream">{hero.name}</p>
              </div>
            </Link>
          </div>
        )}
      </section>

      <div className="shell"><div className="hairline" /></div>

      {/* COLLECTION */}
      <section id="collection" className="shell scroll-mt-24 py-20">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">International Collection</p>
            <h2 className="mt-4 font-display text-4xl font-light text-ink sm:text-5xl dark:text-ink-dark">
              Available for worldwide shipping
            </h2>
          </div>
          <p className="text-sm text-moss dark:text-cream/50">{plants.length} specimens · All prices in THB</p>
        </div>
        <ProductGrid plants={plants} groups={groups} />
      </section>
    </>
  );
}
