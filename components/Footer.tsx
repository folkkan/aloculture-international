const MESSENGER = process.env.NEXT_PUBLIC_MESSENGER_PAGE ?? "folkkan";
const WHATSAPP = process.env.NEXT_PUBLIC_WHATSAPP_URL;
const LINE = process.env.NEXT_PUBLIC_LINE_URL;

export function Footer() {
  return (
    <footer id="contact" className="mt-32 border-t border-ink/10 dark:border-cream/10">
      <div className="shell grid gap-12 py-16 md:grid-cols-[1.5fr_1fr]">
        <div className="max-w-md">
          <p className="font-display text-2xl text-ink dark:text-ink-dark">Aloculture Plants</p>
          <p className="mt-1 text-xs uppercase tracking-eyebrow text-moss dark:text-cream/50">International</p>
          <p className="mt-4 text-sm leading-relaxed text-moss dark:text-cream/60">
            Rare variegated Alocasia, grown in Thailand. Collector-grade specimens for serious collectors. All prices in THB.
          </p>
        </div>
        <div>
          <p className="eyebrow">Enquire & Order</p>
          <ul className="mt-4 space-y-3">
            <li>
              <a href={`https://m.me/${MESSENGER}`} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-ink/80 underline-offset-4 transition-colors hover:text-forest hover:underline dark:text-cream/80 dark:hover:text-cream">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.908 1.37 5.507 3.52 7.25v3.507l3.256-1.812c.87.244 1.79.375 2.724.375 5.523 0 10-4.145 10-9.243S17.523 2 12 2Zm.99 12.44-2.548-2.72-4.97 2.72 5.47-5.806 2.61 2.72 4.906-2.72-5.469 5.806Z"/></svg>
                Facebook Messenger →
              </a>
            </li>
            {WHATSAPP && (
              <li>
                <a href={WHATSAPP} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-ink/80 underline-offset-4 transition-colors hover:text-forest hover:underline dark:text-cream/80 dark:hover:text-cream">
                  WhatsApp →
                </a>
              </li>
            )}
            {LINE && (
              <li>
                <a href={LINE} target="_blank" rel="noopener noreferrer"
                  className="text-sm text-ink/80 underline-offset-4 transition-colors hover:text-forest hover:underline dark:text-cream/80 dark:hover:text-cream">
                  Line →
                </a>
              </li>
            )}
          </ul>
          <p className="mt-6 text-xs text-moss dark:text-cream/40">
            🌿 Grown in Thailand · 💰 Prices in THB
          </p>
        </div>
      </div>
      <div className="shell flex flex-col gap-2 border-t border-ink/5 py-6 text-xs text-moss sm:flex-row sm:items-center sm:justify-between dark:border-cream/5 dark:text-cream/40">
        <span>© {new Date().getFullYear()} Aloculture Plants. All rights reserved.</span>
        <span>Thailand · International Store</span>
      </div>
    </footer>
  );
}
