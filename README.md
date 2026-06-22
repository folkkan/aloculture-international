# Variegata Atelier — Alocasia Catalog

เว็บแสดงสินค้า (showcase) สำหรับธุรกิจ Alocasia ด่าง ดึงข้อมูลจาก **Airtable** มาแสดงด้วย UI ระดับพรีเมียม สไตล์ Apple — เน้นภาพถ่ายขนาดใหญ่ รองรับ dark mode, mobile-first, SEO และพร้อม deploy บน **Netlify**

สร้างด้วย **Next.js 15 (App Router) · TypeScript · Tailwind CSS**

---

## 1. ติดตั้งและรันในเครื่อง

```bash
npm install
cp .env.example .env.local   # แล้วใส่ค่าจริงของคุณ
npm run dev                  # เปิด http://localhost:3000
```

> เว็บจะรันได้ทันทีแม้ยังไม่ใส่ key ของ Airtable โดยจะแสดง **ข้อมูลตัวอย่าง** ให้ดูดีไซน์ก่อน เมื่อใส่ key จริงแล้วข้อมูลจาก Airtable จะถูกดึงมาแทนอัตโนมัติ

---

## 2. เชื่อม Airtable

### 2.1 สร้าง Personal Access Token
ไปที่ https://airtable.com/create/tokens แล้วสร้าง token โดยให้สิทธิ์:
- Scope: `data.records:read`
- Access: เลือก base ที่เก็บข้อมูลต้นไม้ (`appjWdfIFws3I1M9y`)

นำค่าไปใส่ใน `.env.local`:
```
AIRTABLE_API_KEY=pat...
AIRTABLE_BASE_ID=appjWdfIFws3I1M9y
AIRTABLE_TABLE_NAME=Plants
```

### 2.2 ตั้งชื่อคอลัมน์ใน Airtable
ผม map ให้ตรงกับ base `@Aloculture.plant` ของคุณแล้ว (ปรับได้ที่ `lib/airtable.ts` → `FIELDS`):

| ภายในโค้ด    | คอลัมน์ใน Airtable ของคุณ | หมายเหตุ                              |
| ------------ | ------------------------- | ------------------------------------ |
| name         | `Species name.`           | ⚠️ มีจุด (.) ต่อท้าย ต้องตรงเป๊ะ        |
| photos       | `Photos`                  | attachment                           |
| sku          | `Species code`            | ⚠️ ยืนยันชื่อเต็ม (ในภาพโดนตัด)         |
| available    | `Stock Status`            | single select: Available / Sold      |
| price        | `Pot plant price (THB)`   | ⚠️ ยืนยันชื่อเต็ม — ราคาที่โชว์หน้าเว็บ |
| resellerPrice| `PRICE (from)`            | ⚠️ ยืนยันชื่อเต็ม — ไม่โชว์สาธารณะ      |
| group        | `Group`                   | ถ้าไม่มี ตัวกรองจะไม่แสดง (ไม่ error)    |
| description  | `Description`             | ถ้าอยู่ใน hidden fields ใส่ชื่อให้ตรง    |
| size         | `Size`                    | optional                             |
| featured     | `Featured`                | checkbox — ถ้าไม่มี ใช้ 3 ต้นแรกใน hero |

> ⚠️ 3 คอลัมน์ที่มีเครื่องหมาย — ชื่อในภาพถูกตัด ผมใส่ชื่อที่เดาไว้ ถ้าไม่ตรง field นั้นจะแสดงว่าง (ไม่ crash) แค่แก้ค่าใน `FIELDS` ให้ตรงชื่อจริง

> **คุมว่าจะโชว์ต้นไหน:** สร้าง view ใน Airtable (เช่น กรอง Stock Status = Available, ซ่อนแถวทดสอบ) แล้วใส่ชื่อ view ใน `AIRTABLE_VIEW` เว็บจะดึงเฉพาะ view นั้น

---

## 3. ฟังก์ชัน Airtable ที่ใช้ซ้ำได้ (`lib/airtable.ts`)

```ts
getPlants()            // ดึงต้นไม้ทั้งหมด
getPlantById(id)       // ดึงทีละต้นด้วย record id
getFeaturedPlants()    // ต้นที่ติ๊ก Featured (ถ้าไม่มี ใช้ 3 ต้นแรก)
getGroups()            // รายชื่อกลุ่มทั้งหมด (ไว้ทำตัวกรอง)
airtableConfigured()   // เช็คว่าตั้งค่า key ครบไหม
```

ทุกฟังก์ชันคืนค่าเป็น type `Plant` ที่ map ไว้เรียบร้อย — เอาไปใช้ในหน้าอื่นหรือ API route ได้เลย

---

## 4. Deploy บน Netlify

1. push โค้ดขึ้น GitHub
2. ที่ Netlify → **Add new site → Import an existing project** → เลือก repo
3. Build settings ตรวจอัตโนมัติจาก `netlify.toml` แล้ว (ไม่ต้องตั้งเอง):
   - Build command: `npm run build`
   - Plugin `@netlify/plugin-nextjs` ติดตั้งให้เอง
4. ไปที่ **Site settings → Environment variables** ใส่ค่าทั้งหมดจาก `.env.example`
5. กด **Deploy** — เสร็จ

> หลังแก้ข้อมูลใน Airtable หน้าเว็บจะอัปเดตเองทุก 1 ชั่วโมง (ISR). อยากให้อัปเดตทันที กด **Trigger deploy** หรือเพิ่ม Airtable webhook → Netlify build hook

---

## 5. ข้อควรรู้: รูปจาก Airtable หมดอายุ

URL รูปแนบ (attachment) ของ Airtable เป็น URL ชั่วคราว หมดอายุในไม่กี่ชั่วโมง ตัวเว็บตั้ง ISR ดึงใหม่ทุก 1 ชม. (อยู่ในช่วงที่ URL ยังไม่หมดอายุ) จึงใช้งานได้ปกติ

**สำหรับ production จริงจัง** แนะนำ re-host รูปไว้บน CDN ของตัวเอง (เช่น Cloudinary, Cloudflare Images) แล้วเก็บ URL ถาวรไว้ใน field แทน — แก้ที่ `lib/airtable.ts` ฟังก์ชัน `toImages()` ให้อ่านจาก field URL แทน attachment

---

## โครงสร้างโปรเจกต์

```
app/
  layout.tsx          # fonts, SEO metadata, theme
  page.tsx            # หน้าแรก: hero + grid
  plants/[id]/page.tsx# หน้ารายละเอียดสินค้า + JSON-LD
  sitemap.ts robots.ts
components/            # Header, Footer, ProductCard/Grid, PlantImage, ThemeToggle
lib/
  airtable.ts         # service layer + sample data
  types.ts format.ts
```
