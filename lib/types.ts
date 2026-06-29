export interface PlantImage {
  url: string;
  width?: number;
  height?: number;
  thumbUrl?: string;
}

export interface Plant {
  id: string;
  name: string;
  /** Botanical / variety name, e.g. "Alocasia 'Dragon Tooth' variegata" */
  variety?: string;
  price?: number;
  /** Optional reseller price (เซล) */
  resellerPrice?: number;
  currency: string;
  group?: string;
  description?: string;
  size?: string;
  sku?: string;
  /** true = in stock */
  available: boolean;
  featured: boolean;
  badge?: string;
  images: PlantImage[];
}
