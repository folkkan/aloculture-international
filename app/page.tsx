import Image from "next/image";
import Link from "next/link";
import { getPlants, getGroups } from "@/lib/airtable";
import { ProductGrid } from "@/components/ProductGrid";
import { PlantImage } from "@/components/PlantImage";
import { SearchBar } from "@/components/SearchBar";

export const revalidate = 30;

export default async function HomePage() {
  const [plants, groups] = await Promise.all([getPlants(), getGroups()]);
  const hero = plants[Math.floor(Math.random() * Math.min(plants.length, 10))];

  return (
    <>
      <section className="shell grid items-center gap-10 pb-20 pt-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:pt-20">
        <div className="animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-cream/60 px-4 py-2 backdrop-blur-sm dark:border-cream/10 dark:bg-surface-dark/60">
            <Image src="/logo.png" alt="Aloculture Plants" width={28} height={28} className="object-contain" />
            <span className="font-sans text-xs uppercase tracking-eyebrow text-moss dark:text-cream/60">
              Aloculture Plants · Dealer Price
            </span>
          </div>

          <h1 className="font-display text-[2.6rem] font-light leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl dark:text-ink-dark">
            Living specimens,
            <br />
            <span className="italic">grown with</span> patience.
          </h1>

          <p className="mt-7 max-w-md text-base leading-relaxed text-moss dark:text-cream/60">
            Exceptionally rare variegated Alocasia, grown in Thailand. Each specimen individually selected for serious collectors.
          </p>

          <div className="mt-7 max-w-md">
            <SearchBar plants={plants} />
          </div>

          <div className="mt-6 flex items-center gap-7">
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

      <section id="collection" className="shell scroll-mt-24 py-20">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Dealer Price Collection</p>
            <h2 className="mt-4 font-display text-4xl font-light text-ink sm:text-5xl dark:text-ink-dark">
              Currently available
            </h2>
          </div>
          <p className="text-sm text-moss

cd ~/Downloads/aloculture-international && cat > app/page.tsx << 'ENDOFFILE'
import Image from "next/image";
import Link from "next/link";
import { getPlants, getGroups } from "@/lib/airtable";
import { ProductGrid } from "@/components/ProductGrid";
import { PlantImage } from "@/components/PlantImage";
import { SearchBar } from "@/components/SearchBar";

export const revalidate = 30;

export default async function HomePage() {
  const [plants, groups] = await Promise.all([getPlants(), getGroups()]);
  const hero = plants[Math.floor(Math.random() * Math.min(plants.length, 10))];

  return (
    <>
      <section className="shell grid items-center gap-10 pb-20 pt-12 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:pt-20">
        <div className="animate-fade-up">
          <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-ink/10 bg-cream/60 px-4 py-2 backdrop-blur-sm dark:border-cream/10 dark:bg-surface-dark/60">
            <Image src="/logo.png" alt="Aloculture Plants" width={28} height={28} className="object-contain" />
            <span className="font-sans text-xs uppercase tracking-eyebrow text-moss dark:text-cream/60">
              Aloculture Plants · Dealer Price
            </span>
          </div>

          <h1 className="font-display text-[2.6rem] font-light leading-[1.05] tracking-tight text-ink sm:text-6xl lg:text-7xl dark:text-ink-dark">
            Living specimens,
            <br />
            <span className="italic">grown with</span> patience.
          </h1>

          <p className="mt-7 max-w-md text-base leading-relaxed text-moss dark:text-cream/60">
            Exceptionally rare variegated Alocasia, grown in Thailand. Each specimen individually selected for serious collectors.
          </p>

          <div className="mt-7 max-w-md">
            <SearchBar plants={plants} />
          </div>

          <div className="mt-6 flex items-center gap-7">
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

      <section id="collection" className="shell scroll-mt-24 py-20">
        <div className="mb-12 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">Dealer Price Collection</p>
            <h2 className="mt-4 font-display text-4xl font-light text-ink sm:text-5xl dark:text-ink-dark">
              Currently available
            </h2>
          </div>
          <p className="text-sm text-moss dark:text-cream/50">{plants.length} specimens · Prices in THB</p>
        </div>
        <ProductGrid plants={plants} groups={groups} />
      </section>
    </>
  );
}
