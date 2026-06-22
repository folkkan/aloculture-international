export function formatPrice(value: number | undefined, currency = "THB"): string {
  if (value === undefined || value === null) return "Enquire";
  try {
    return new Intl.NumberFormat("th-TH", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return `${value.toLocaleString()} ${currency}`;
  }
}
