#!/usr/bin/env node
/**
 * inspect-airtable.mjs
 * ดูชื่อคอลัมน์จริงทั้งหมดใน Airtable (รวม hidden fields) + ค่าตัวอย่าง
 *
 * วิธีใช้:
 *   node scripts/inspect-airtable.mjs YOUR_TOKEN
 *   หรือ  AIRTABLE_API_KEY=pat... node scripts/inspect-airtable.mjs
 */

const TOKEN = process.argv[2] || process.env.AIRTABLE_API_KEY;
const BASE_ID = process.env.AIRTABLE_BASE_ID || "appjWdfIFws3I1M9y";
const TABLE_ID = process.env.AIRTABLE_TABLE_NAME || "tblT2TwmrN399ktQQ";

if (!TOKEN) {
  console.error("\n❌ ใส่ token ด้วย:  node scripts/inspect-airtable.mjs YOUR_TOKEN\n");
  process.exit(1);
}

const url = `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent(
  TABLE_ID
)}?maxRecords=5`;

const res = await fetch(url, {
  headers: { Authorization: `Bearer ${TOKEN}` },
});

if (!res.ok) {
  console.error(`\n❌ Airtable error ${res.status}: ${await res.text()}\n`);
  process.exit(1);
}

const { records } = await res.json();
if (!records?.length) {
  console.error("\n⚠️ ไม่พบ record\n");
  process.exit(0);
}

// รวมชื่อ field ทั้งหมดจากทุก record (กัน field ว่างในบางแถว)
const fieldNames = new Set();
records.forEach((r) => Object.keys(r.fields).forEach((k) => fieldNames.add(k)));

console.log("\n=== คอลัมน์จริงทั้งหมด (พร้อมค่าตัวอย่างจากแถวแรกๆ) ===\n");
for (const name of fieldNames) {
  const sample = records.map((r) => r.fields[name]).find((v) => v !== undefined);
  let preview;
  if (Array.isArray(sample) && sample[0]?.url) {
    preview = `[attachment x${sample.length}] ${sample[0].url.slice(0, 40)}...`;
  } else if (typeof sample === "object") {
    preview = JSON.stringify(sample).slice(0, 50);
  } else {
    preview = String(sample).slice(0, 50);
  }
  console.log(`  "${name}"`.padEnd(34) + ` →  ${preview}`);
}

console.log(
  "\n=== คัดลอกชื่อด้านบนไปวางใน lib/airtable.ts → FIELDS ให้ตรง ===\n"
);
