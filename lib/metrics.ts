import { Item, getProfit, getDaysToSell, getStatus, Category, CATEGORIES } from "./types";

export interface DashboardMetrics {
  totalProfit: number;
  totalSpent: number;
  totalRevenue: number;
  roi: number | null;
  avgDaysToSell: number | null;
  activeCount: number;
  activeValue: number;
  soldCount: number;
  categoryBreakdown: { category: Category; profit: number; count: number }[];
  monthlyTrend: { month: string; profit: number }[];
  bestFlip: Item | null;
  bestFlipProfit: number;
}

export function computeMetrics(items: Item[]): DashboardMetrics {
  let totalProfit = 0;
  let totalSpent = 0;
  let totalRevenue = 0;
  let activeCount = 0;
  let activeValue = 0;
  let soldCount = 0;
  const daysList: number[] = [];
  const catMap = new Map<Category, { profit: number; count: number }>();
  const monthMap = new Map<string, number>();
  let bestFlip: Item | null = null;
  let bestProfit = -Infinity;

  for (const item of items) {
    const status = getStatus(item);
    const profit = getProfit(item);

    if (status === "active") {
      activeCount += 1;
      activeValue += item.buyPrice ?? 0;
    } else {
      soldCount += 1;
      if (profit !== null) {
        totalProfit += profit;
        if (profit > bestProfit) {
          bestProfit = profit;
          bestFlip = item;
        }
      }
      if (item.buyPrice) totalSpent += item.buyPrice;
      if (item.sellPrice) totalRevenue += item.sellPrice;

      const days = getDaysToSell(item);
      if (days !== null) daysList.push(days);

      const cat = catMap.get(item.category) ?? { profit: 0, count: 0 };
      cat.profit += profit ?? 0;
      cat.count += 1;
      catMap.set(item.category, cat);

      if (item.sellDate) {
        const d = new Date(item.sellDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        monthMap.set(key, (monthMap.get(key) ?? 0) + (profit ?? 0));
      }
    }
  }

  const roi = totalSpent > 0 ? (totalProfit / totalSpent) * 100 : null;
  const avgDaysToSell =
    daysList.length > 0 ? Math.round(daysList.reduce((a, b) => a + b, 0) / daysList.length) : null;

  const categoryBreakdown = CATEGORIES.map((category) => ({
    category,
    profit: catMap.get(category)?.profit ?? 0,
    count: catMap.get(category)?.count ?? 0,
  })).filter((c) => c.count > 0);

  const monthlyTrend = Array.from(monthMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, profit]) => ({ month, profit }));

  return {
    totalProfit,
    totalSpent,
    totalRevenue,
    roi,
    avgDaysToSell,
    activeCount,
    activeValue,
    soldCount,
    categoryBreakdown,
    monthlyTrend,
    bestFlip,
    bestFlipProfit: bestFlip ? bestProfit : 0,
  };
}
