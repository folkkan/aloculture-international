import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPlantById, getPlants } from "@/lib/airtable";
import { formatPrice } from "@/lib/format";
import { PlantGallery } from "@/components/PlantGallery";

export const revalidate = 30;

export async function generateStaticParams() {
  const plants = await getPlants();
  return plants.map((p) => ({ id: p.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const plant = await getPlantById(id);
  if (!plant) return { title: "Specimen not found" };
  return {
    title: plant.name,
    description:
      plant.description ??
      `${plant.variety ?? plant.name} — rare variegated Alocasia.`,
    openGraph: {
      title: plant.name,
      description: plant.description ?? plant.variety ?? plant.name,
      images: plant.images[0]?.url ? [{ url: plant.images[0].url }] : [],
    },
  };
}

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.netlify.app";

export default async function PlantPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const plant = await getPlantById(id);
  if (!plant) notFound();

  const plantUrl = `${SITE_URL}/plants/${plant.id}`;

  const specs = [
    { label: "Variety", value: plant.variety },
    { label: "Group", value: plant.group },
    { label: "Size / Pot", value: plant.size },
    { label: "Species Code", value: plant.sku },
  ].filter((s) => s.value);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: plant.name,
    description: plant.description ?? plant.variety,
    image: plant.images.map((i) => i.url),
    sku: plant.sku,
    offers: plant.price
      ? {
          "@type": "Offer",
          price: plant.price,
          priceCurrency: plant.currency,
          availability: plant.available
            ? "https://schema.org/InStock"
            : "https://schema.org/SoldOut",
        }
      : undefined,
  };

  return (
    <article className="shell py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/#collection"
        className="inline-flex items-center gap-1.5 text-sm text-moss underline-offset-4 transition-colors hover:text-forest dark:text-cream/50 dark:hover:text-cream"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M19 12H5M12 5l-7 7 7 7"/>
        </svg>
        Back to collection
      </Link>

      <div className="mt-8 grid gap-10 md:grid-cols-2 md:gap-14">

        {/* LEFT — Gallery: selected image state lives here (client) */}
        <PlantGallery
          images={plant.images}
          plantId={plant.id}
          plantName={plant.name}
          plantUrl={plantUrl}
        />

        {/* RIGHT — Info */}
        <div className="flex flex-col md:pt-2">
          {plant.group && <p className="eyebrow">{plant.group}</p>}

          <h1 className="mt-3 font-display text-4xl font-light leading-tight text-ink sm:text-5xl dark:text-ink-dark">
            {plant.name}
          </h1>

          {plant.variety && (
            <p className="mt-2 font-display text-lg italic text-moss dark:text-cream/50">
              {plant.variety}
            </p>
          )}

          <p className="mt-6 font-sans text-3xl tabular-nums text-ink dark:text-ink-dark">
            {formatPrice(plant.price, plant.currency)}
          </p>

          <div className="mt-3">
            {plant.available ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                Available
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600 dark:bg-red-900/30 dark:text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                Reserved
              </span>
            )}
          </div>

          {plant.description && (
            <p className="mt-7 max-w-prose text-[15px] leading-relaxed text-ink/75 dark:text-cream/65">
              {plant.description}
            </p>
          )}

          {specs.length > 0 && (
            <dl className="mt-8 divide-y divide-ink/8 border-t border-ink/10 dark:divide-cream/8 dark:border-cream/10">
              {specs.map((s) => (
                <div key={s.label} className="flex justify-between gap-4 py-3 text-sm">
                  <dt className="text-moss dark:text-cream/50">{s.label}</dt>
                  <dd className="text-right font-medium text-ink dark:text-ink-dark">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}

          {/* Note: Messenger CTA on desktop is inside PlantGallery (tracks selected image) */}
          <p className="mt-8 hidden text-xs text-moss md:block dark:text-cream/40">
            กดที่รูปใน gallery เพื่อเลือก — ระบบจะส่งรูปที่เลือกไปพร้อม Messenger อัตโนมัติ
          </p>
        </div>
      </div>
    </article>
  );
}
