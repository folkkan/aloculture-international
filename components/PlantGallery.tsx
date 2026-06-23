"use client";
import { useState } from "react";
import Image from "next/image";
import type { PlantImage } from "@/lib/types";
import { MessengerButton } from "./MessengerButton";
interface Props { images: PlantImage[]; plantId: string; plantName: string; plantUrl: string; messengerOnly?: boolean; }
export function PlantGallery({ images, plantId, plantName, plantUrl, messengerOnly }: Props) {
  const [selected, setSelected] = useState(0);
  const [saving, setSaving] = useState(false);
  const [savedAll, setSavedAll] = useState(false);
  const current = images[selected];
  function saveImage(url: string, filename: string) {
    const a = document.createElement("a");
    a.href = url; a.download = filename; a.target = "_blank"; a.rel = "noopener noreferrer";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
  }
  async function saveAllImages() {
    if (saving) return; setSaving(true); setSavedAll(false);
    for (let i = 0; i < images.length; i++) {
      saveImage(images[i].url, plantName.replace(/\s+/g, "-") + "-" + (i+1) + ".jpg");
      if (i < images.length - 1) await new Promise(r => setTimeout(r, 600));
    }
    setSaving(false); setSavedAll(true); setTimeout(() => setSavedAll(false), 3000);
  }
  if (messengerOnly) return <MessengerButton plantId={plantId} plantName={plantName} plantUrl={plantUrl} selectedImageUrl={current?.url}/>;
  if (images.length === 0) return <div className="flex aspect-[4/5] items-center justify-center rounded-[4px] bg-cream/30 dark:bg-surface-dark"><p className="font-display italic text-moss">No photos</p></div>;
  const isIOS = typeof navigator !== "undefined" && /iphone|ipad|ipod/i.test(navigator.userAgent);
  return (
    <div className="space-y-3">
      <div className="group relative aspect-[4/5] overflow-hidden rounded-[4px] bg-cream/30 dark:bg-surface-dark">
        <Image src={current.url} alt={plantName + " photo " + (selected+1)} fill sizes="(max-width: 768px) 100vw, 50vw" priority className="object-cover"/>
        {isIOS ? (
          <div className="absolute right-3 top-3 rounded-full bg-black/55 px-3 py-1.5 text-[11px] text-white backdrop-blur-sm">Hold to save</div>
        ) : (
          <button type="button" onClick={() => saveImage(current.url, plantName.replace(/\s+/g,"-")+"-"+(selected+1)+".jpg")} className="absolute right-3 top-3 flex items-center gap-1.5 rounded-full bg-black/55 px-3 py-1.5 text-[11px] font-medium text-white backdrop-blur-sm hover:bg-black/75 active:scale-95">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Save photo
          </button>
        )}
        {images.length > 1 && <span className="absolute bottom-3 right-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px] tabular-nums text-white backdrop-blur-sm">{selected+1} / {images.length}</span>}
      </div>
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, i) => (
            <button key={i} type="button" onClick={() => setSelected(i)} className={"relative aspect-square overflow-hidden rounded-[3px] transition-all " + (i===selected ? "ring-2 ring-forest ring-offset-1 dark:ring-cream" : "opacity-55 hover:opacity-100")}>
              <Image src={img.thumbUrl ?? img.url} alt="" fill sizes="80px" className="object-cover"/>
            </button>
          ))}
        </div>
      )}
      {images.length > 1 && !isIOS && (
        <button type="button" onClick={saveAllImages} disabled={saving} className="flex w-full items-center justify-center gap-2 rounded-full border border-ink/15 py-3 text-sm text-ink/65 transition-all hover:border-forest/40 hover:text-forest disabled:opacity-50 dark:border-cream/15 dark:text-cream/55">
          {saving ? "Saving..." : savedAll ? "All saved ✓" : "Save all photos (" + images.length + " photos)"}
        </button>
      )}
      {isIOS && images.length > 1 && (
        <div className="rounded-xl border border-ink/10 bg-ink/4 px-4 py-3 text-center text-xs text-moss dark:border-cream/10 dark:text-cream/50">
          📱 iPhone: Hold on photo → Add to Photos
        </div>
      )}
      <div className="pt-1"><MessengerButton plantId={plantId} plantName={plantName} plantUrl={plantUrl} selectedImageUrl={current?.url}/></div>
    </div>
  );
}