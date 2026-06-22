import Airtable, { type FieldSet, type Records } from "airtable";
import type { Plant, PlantImage } from "./types";

export const FIELDS = {
  name: "Plant CODE",
  variety: "Plant Category",
  price: "PRICE (from Species Name)",  // ราคาต่างชาติ THB
  resellerPrice: "Pot plant price (SPECIES CODE) (from Pot plant price (from SPECIES CODE))",
  group: "Plant Category",
  description: "Description",
  size: "Size",
  sku: "Species code (SPECIES CODE) (from Pot plant price (from SPECIES CODE))",
  available: "Stock Status",
  featured: "Featured",
  photos: "Photos",
} as const;

const BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME ?? "Plants";
const API_KEY = process.env.AIRTABLE_API_KEY ?? "";
const VIEW = process.env.AIRTABLE_VIEW ?? "";
export const CURRENCY = "THB";

let base: ReturnType<Airtable["base"]> | null = null;
const isConfigured = Boolean(BASE_ID && API_KEY);

function getBase() {
  if (!isConfigured) return null;
  if (!base) base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);
  return base;
}

type AnyFields = FieldSet & Record<string, unknown>;

function toImages(value: unknown): PlantImage[] {
  if (!Array.isArray(value)) return [];
  const out: PlantImage[] = [];
  for (const att of value) {
    const a = att as { url?: string; width?: number; height?: number; thumbnails?: { large?: { url?: string } } };
    if (!a?.url) continue;
    out.push({ url: a.url, width: a.width, height: a.height, thumbUrl: a.thumbnails?.large?.url ?? a.url });
  }
  return out;
}

function toNumber(value: unknown): number | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function toString(value: unknown): string | undefined {
  const v = Array.isArray(value) ? value[0] : value;
  if (typeof v === "string" && v.trim() !== "") return v.trim();
  return undefined;
}

function toAvailable(value: unknown): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (!v) return true;
    const unavailable = ["sold", "sold out", "reserved", "out of stock", "ขายแล้ว", "จอง", "หมด"];
    return !unavailable.some((u) => v.includes(u));
  }
  return true;
}

function mapRecord(id: string, f: AnyFields): Plant {
  const name = toString(f[FIELDS.name]) ?? toString(f["Plant CODE"]) ?? "Untitled specimen";
  return {
    id,
    name,
    variety: toString(f[FIELDS.variety]),
    price: toNumber(f[FIELDS.price]),
    resellerPrice: toNumber(f[FIELDS.resellerPrice]),
    currency: CURRENCY,
    group: toString(f[FIELDS.group]),
    description: toString(f[FIELDS.description]),
    size: toString(f[FIELDS.size]),
    sku: toString(f[FIELDS.sku]),
    available: toAvailable(f[FIELDS.available]),
    featured: Boolean(f[FIELDS.featured]),
    images: toImages(f[FIELDS.photos]),
  };
}

function mapRecords(records: Records<FieldSet>): Plant[] {
  return records.map((r) => mapRecord(r.id, r.fields as AnyFields));
}

export async function getPlants(): Promise<Plant[]> {
  const b = getBase();
  if (!b) return SAMPLE_PLANTS;
  const records = await b(TABLE_NAME)
    .select(VIEW ? { pageSize: 100, view: VIEW } : { pageSize: 100 })
    .all();
  return mapRecords(records).filter((p) => p.available && p.price !== undefined);
}

export async function getPlantById(id: string): Promise<Plant | null> {
  const b = getBase();
  if (!b) return SAMPLE_PLANTS.find((p) => p.id === id) ?? null;
  try {
    const record = await b(TABLE_NAME).find(id);
    return mapRecord(record.id, record.fields as AnyFields);
  } catch { return null; }
}

export async function getFeaturedPlants(): Promise<Plant[]> {
  const all = await getPlants();
  const featured = all.filter((p) => p.featured);
  return featured.length > 0 ? featured : all.slice(0, 3);
}

export async function getGroups(): Promise<string[]> {
  const all = await getPlants();
  const set = new Set<string>();
  all.forEach((p) => p.group && set.add(p.group));
  return Array.from(set).sort();
}

export function airtableConfigured(): boolean { return isConfigured; }

const ph = (seed: string) => `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1400&q=80`;

export const SAMPLE_PLANTS: Plant[] = [
  { id: "sample-1", name: "Amazonica polly true pink", variety: "Potted plants", price: 25, currency: "THB", group: "Potted plants", available: true, featured: true, images: [{ url: ph("photo-1632321628239-86dca1a1f5a1") }] },
  { id: "sample-2", name: "Antoro pink", variety: "Potted plants", price: 980, currency: "THB", group: "Potted plants", available: true, featured: true, images: [{ url: ph("photo-1604762512526-b7068fe9b3d8") }] },
];
