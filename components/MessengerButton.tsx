"use client";

interface Props {
  plantId: string;
  plantName: string;
  plantUrl: string;
  selectedImageUrl?: string;
}

const MESSENGER_PAGE = process.env.NEXT_PUBLIC_MESSENGER_PAGE ?? "folkkan";

export function MessengerButton({ plantId, plantName, plantUrl, selectedImageUrl }: Props) {
  function buildLink() {
    const msg = [
      `🌿 International Enquiry`,
      `Plant: ${plantName}`,
      `ID: ${plantId}`,
      `Link: ${plantUrl}`,
      selectedImageUrl ? `Photo: ${selectedImageUrl}` : "",
    ].filter(Boolean).join("\n");
    return `https://m.me/${MESSENGER_PAGE}?text=${encodeURIComponent(msg)}`;
  }

  return (
    <a href={buildLink()} target="_blank" rel="noopener noreferrer"
      className="group flex w-full items-center justify-center gap-3 rounded-full bg-[#0866FF] px-8 py-4 text-sm font-medium text-white shadow-lg shadow-[#0866FF]/20 transition-all duration-300 ease-smooth hover:bg-[#0557e0] active:scale-[0.98]">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.37 5.507 3.52 7.25v3.507l3.256-1.812c.87.244 1.79.375 2.724.375 5.523 0 10-4.145 10-9.243S17.523 2 12 2Zm.99 12.44-2.548-2.72-4.97 2.72 5.47-5.806 2.61 2.72 4.906-2.72-5.469 5.806Z"/>
      </svg>
      Enquire About This Plant
    </a>
  );
}
