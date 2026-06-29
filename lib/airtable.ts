import Airtable, { type FieldSet, type Records } from "airtable";
import type { Plant, PlantImage } from "./types";

/* -------------------------------------------------------------------------- */
/*  CONFIG                                                                     */
/* -------------------------------------------------------------------------- */
/*
 * ปรับชื่อ field ตรงนี้ให้ตรงกับ Airtable ของคุณได้เลย (เปลี่ยนค่าฝั่งขวา)
 * Map your Airtable column names here. Keys are stable internal names;
 * values are the exact field names in your Airtable "Plants" table.
 */
export const FIELDS = {
  name: "Plant CODE",
  variety: "Plant Category",
  price: "Pot plant price (SPECIES CODE) (from Pot plant price (from SPECIES CODE))",
  resellerPrice: "PRICE (from Species Name)",
  group: "Plant Category",
  description: "Description",
  size: "Size",
  sku: "Species code (SPECIES CODE) (from Pot plant price (from SPECIES CODE))",
  available: "Stock Status",
  featured: "Featured",
  photos: "Photos",
  badge: "Badge",
} as const;

const BASE_ID = process.env.AIRTABLE_BASE_ID ?? "";
const TABLE_NAME = process.env.AIRTABLE_TABLE_NAME ?? "Plants";
const API_KEY = process.env.AIRTABLE_API_KEY ?? "";
// (ไม่บังคับ) ชื่อ view ใน Airtable — ใช้คุมว่าจะโชว์ต้นไหน + ลำดับ
const VIEW = process.env.AIRTABLE_VIEW ?? "";
export const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "THB";

const isConfigured = Boolean(BASE_ID && API_KEY);

/* -------------------------------------------------------------------------- */
/*  CLIENT (lazy singleton)                                                    */
/* -------------------------------------------------------------------------- */
let base: ReturnType<Airtable["base"]> | null = null;

function getBase() {
  if (!isConfigured) return null;
  if (!base) {
    base = new Airtable({ apiKey: API_KEY }).base(BASE_ID);
  }
  return base;
}

/* -------------------------------------------------------------------------- */
/*  MAPPERS                                                                    */
/* -------------------------------------------------------------------------- */
type AnyFields = FieldSet & Record<string, unknown>;

function toImages(value: unknown): PlantImage[] {
  if (!Array.isArray(value)) return [];
  const out: PlantImage[] = [];
  for (const att of value) {
    const a = att as {
      url?: string;
      width?: number;
      height?: number;
      thumbnails?: { large?: { url?: string } };
    };
    if (!a?.url) continue;
    out.push({
      url: a.url,
      width: a.width,
      height: a.height,
      thumbUrl: a.thumbnails?.large?.url ?? a.url,
    });
  }
  return out;
}

function toNumber(value: unknown): number | undefined {
  // Lookup fields คืนเป็น array เช่น [800] — unwrap ก่อน
  const v = Array.isArray(value) ? value[0] : value;
  if (typeof v === "number") return v;
  if (typeof v === "string" && v.trim() !== "") {
    const n = Number(v.replace(/[^0-9.]/g, ""));
    return Number.isFinite(n) ? n : undefined;
  }
  return undefined;
}

function toString(value: unknown): string | undefined {
  // Lookup fields คืนเป็น array เช่น ["ANP"] — unwrap ก่อน
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
    // ถือว่าพร้อมขาย เว้นแต่สถานะบอกชัดว่าขายแล้ว/จอง/หมด
    const unavailable = [
      "sold",
      "sold out",
      "reserved",
      "out of stock",
      "ขายแล้ว",
      "จอง",
      "หมด",
    ];
    return !unavailable.some((u) => v.includes(u));
  }
  return true; // default to available if field is empty
}

function mapRecord(id: string, f: AnyFields): Plant {
  // fallback: ลอง key ต่างๆ ที่อาจเป็นชื่อต้นไม้
  const name =
    toString(f[FIELDS.name]) ??
    toString(f["Species name."]) ??
    toString(f["Species name"]) ??
    toString(f["Name"]) ??
    "Untitled specimen";
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
    badge: toString(f[FIELDS.badge]),
    images: toImages(f[FIELDS.photos]),
  };
}

function mapRecords(records: Records<FieldSet>): Plant[] {
  return records.map((r) => mapRecord(r.id, r.fields as AnyFields));
}

/* -------------------------------------------------------------------------- */
/*  PUBLIC SERVICE FUNCTIONS  (reusable)                                        */
/* -------------------------------------------------------------------------- */

/** Fetch every published plant, newest first. */
export async function getPlants(): Promise<Plant[]> {
  const b = getBase();
  if (!b) return SAMPLE_PLANTS;

  const records = await b(TABLE_NAME)
    .select(VIEW ? { pageSize: 100, view: VIEW } : { pageSize: 100 })
    .all();
  return mapRecords(records).filter((p) => p.available);
}

/** Fetch a single plant by Airtable record id. */
export async function getPlantById(id: string): Promise<Plant | null> {
  const b = getBase();
  if (!b) return SAMPLE_PLANTS.find((p) => p.id === id) ?? null;

  try {
    const record = await b(TABLE_NAME).find(id);
    return mapRecord(record.id, record.fields as AnyFields);
  } catch {
    return null;
  }
}

/** Plants flagged as Featured (falls back to first 3 if none flagged). */
export async function getFeaturedPlants(): Promise<Plant[]> {
  const all = await getPlants();
  const featured = all.filter((p) => p.featured);
  return featured.length > 0 ? featured : all.slice(0, 3);
}

/** Distinct group/category names for filtering. */
export async function getGroups(): Promise<string[]> {
  const all = await getPlants();
  const set = new Set<string>();
  all.forEach((p) => p.group && set.add(p.group));
  return Array.from(set).sort();
}

/** Whether real Airtable credentials are present. */
export function airtableConfigured(): boolean {
  return isConfigured;
}

/* -------------------------------------------------------------------------- */
/*  SAMPLE DATA  — used automatically when no Airtable keys are set            */
/*  so the site builds & previews out of the box.                             */
/* -------------------------------------------------------------------------- */
const ph = (seed: string) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=1400&q=80`;

export const SAMPLE_PLANTS: Plant[] = [
  {
    id: "sample-1",
    name: "Dragon Tooth Variegata",
    variety: "Alocasia baginda 'Dragon Tooth' variegata",
    price: 12500,
    resellerPrice: 9800,
    currency: CURRENCY,
    group: "Dragon Tooth",
    description:
      "ใบหนาเป็นเกล็ดมังกร ด่างขาวครีมกระจายสมมาตร เก็บในระบบ semi-hydro ราก healthy เต็มกระถาง",
    size: 'Pot 4"',
    sku: "DT-VAR-001",
    available: true,
    featured: true,
    images: [{ url: ph("photo-1632321628239-86dca1a1f5a1") }],
  },
  {
    id: "sample-2",
    name: "Stardust Variegata",
    variety: "Alocasia 'Stardust' variegata",
    price: 8900,
    resellerPrice: 6900,
    currency: CURRENCY,
    group: "Stardust",
    description: "ด่างฟ้าผ่าคมชัด ฟอร์มกะทัดรัด เหมาะกับนักสะสมที่ชอบลายแปลก",
    size: 'Pot 3"',
    sku: "SD-VAR-014",
    available: true,
    featured: true,
    images: [{ url: ph("photo-1604762512526-b7068fe9b3d8") }],
  },
  {
    id: "sample-3",
    name: "Charntrieri Pink",
    variety: "Alocasia × chantrieri pink variegata",
    price: 15800,
    resellerPrice: 12500,
    currency: CURRENCY,
    group: "Charntrieri",
    description: "ด่างชมพูพาสเทล หายากมาก ต้นโชว์สำหรับคอลเลกชันระดับพรีเมียม",
    size: 'Pot 5"',
    sku: "CH-PNK-007",
    available: true,
    featured: true,
    images: [{ url: ph("photo-1545241047-6083a3684587") }],
  },
  {
    id: "sample-4",
    name: "Silver Violet",
    variety: "Alocasia 'Silver Violet'",
    price: 4500,
    resellerPrice: 3500,
    currency: CURRENCY,
    group: "Silverviolet",
    description: "ใบเงินอมม่วง ผิวเมทัลลิก ดูแลง่าย เหมาะสำหรับเริ่มสะสม",
    size: 'Pot 3"',
    sku: "SV-002",
    available: false,
    featured: false,
    images: [{ url: ph("photo-1591958911259-bee2173bdccc") }],
  },
  {
    id: "sample-5",
    name: "Grandis Pink",
    variety: "Alocasia grandis pink variegata",
    price: 18900,
    currency: CURRENCY,
    group: "Grandis",
    description: "ใบใหญ่ฟอร์มสวย ด่างชมพูแทรกเขียวเข้ม โชว์พีซตัวจริง",
    size: 'Pot 6"',
    sku: "GR-PNK-001",
    available: true,
    featured: false,
    images: [{ url: ph("photo-1416879595882-3373a0480b5b") }],
  },
  {
    id: "sample-6",
    name: "Lowii Complex",
    variety: "Alocasia lowii complex variegata",
    price: 7200,
    resellerPrice: 5600,
    currency: CURRENCY,
    group: "Lowii",
    description: "เส้นใบขาวตัดเขียวเข้ม ลายคลาสสิกที่นักสะสมตามหา",
    size: 'Pot 4"',
    sku: "LW-VAR-021",
    available: true,
    featured: false,
    images: [{ url: ph("photo-1509423350716-97f9360b4e09") }],
  },
];
