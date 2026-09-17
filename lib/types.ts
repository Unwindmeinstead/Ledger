export type Category =
  | "Bikes"
  | "Hot Tubs"
  | "Liquidation"
  | "Furniture"
  | "Electronics"
  | "Other";

export const CATEGORIES: Category[] = [
  "Bikes",
  "Hot Tubs",
  "Liquidation",
  "Furniture",
  "Electronics",
  "Other",
];

export type Platform =
  | "Facebook Marketplace"
  | "Craigslist"
  | "OfferUp"
  | "eBay"
  | "In Person"
  | "Other";

export const PLATFORMS: Platform[] = [
  "Facebook Marketplace",
  "Craigslist",
  "OfferUp",
  "eBay",
  "In Person",
  "Other",
];

/**
 * A single Item covers three shapes of the same record:
 *  - Flip:        buyDate + buyPrice, later sellDate + sellPrice
 *  - Buy only:    buyDate + buyPrice, still in inventory (unsold)
 *  - Sell only:   sellDate + sellPrice, no linked buy (general sale, no cost basis)
 */
export interface Item {
  id: string;
  title: string;
  category: Category;
  platform: Platform;
  notes?: string;
  buyDate?: string; // ISO date
  buyPrice?: number;
  sellDate?: string; // ISO date
  sellPrice?: number;
  createdAt: string;
}

export type ItemStatus = "active" | "sold" | "logged-sale";

export function getStatus(item: Item): ItemStatus {
  if (item.sellDate && item.sellPrice !== undefined) {
    return item.buyDate ? "sold" : "logged-sale";
  }
  return "active";
}

export function getProfit(item: Item): number | null {
  const hasSell = item.sellPrice !== undefined;
  if (!hasSell) return null;
  const sell = item.sellPrice ?? 0;
  const buy = item.buyPrice ?? 0;
  return sell - buy;
}

export function getRoi(item: Item): number | null {
  const profit = getProfit(item);
  if (profit === null) return null;
  if (!item.buyPrice || item.buyPrice === 0) return null;
  return (profit / item.buyPrice) * 100;
}

export function getDaysToSell(item: Item): number | null {
  if (!item.buyDate || !item.sellDate) return null;
  const buy = new Date(item.buyDate).getTime();
  const sell = new Date(item.sellDate).getTime();
  const days = Math.round((sell - buy) / (1000 * 60 * 60 * 24));
  return days >= 0 ? days : null;
}
