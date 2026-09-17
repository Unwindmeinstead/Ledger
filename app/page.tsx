"use client";

import { useEffect, useMemo, useState } from "react";
import { loadItems } from "@/lib/storage";
import { computeMetrics } from "@/lib/metrics";
import { formatMoney, formatMoneySigned, monthLabel } from "@/lib/format";
import { Item } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import EmptyState from "@/components/EmptyState";
import ItemRow from "@/components/ItemRow";
import BottomNav from "@/components/BottomNav";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Cell,
} from "recharts";

export default function DashboardPage() {
  const [items, setItems] = useState<Item[] | null>(null);

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const metrics = useMemo(() => computeMetrics(items ?? []), [items]);

  if (items === null) return null;

  const recent = items.slice(0, 5);
  const profitPositive = metrics.totalProfit >= 0;

  return (
    <div className="pb-28">
      <PageHeader title="Ledger" subtitle="Your marketplace buys &amp; sells" />

      {items.length === 0 ? (
        <EmptyState
          title="Nothing logged yet"
          body="Log your first buy or sell to start tracking profit across your flips."
          ctaLabel="Log an item"
          ctaHref="/log"
        />
      ) : (
        <>
          {/* Hero metric */}
          <section className="px-5 pt-1 pb-5">
            <p className="text-sm text-inkmuted mb-1">Total profit</p>
            <p
              className={`font-serif text-[44px] leading-none font-semibold ${
                profitPositive ? "text-ink" : "text-loss"
              }`}
            >
              {formatMoneySigned(metrics.totalProfit)}
            </p>
            <p className="text-sm text-inkmuted mt-2">
              {metrics.roi !== null
                ? `${metrics.roi >= 0 ? "+" : ""}${metrics.roi.toFixed(0)}% ROI across ${metrics.soldCount} sale${metrics.soldCount === 1 ? "" : "s"}`
                : `${metrics.soldCount} sale${metrics.soldCount === 1 ? "" : "s"} logged`}
            </p>
          </section>

          {/* Stat grid */}
          <section className="grid grid-cols-2 gap-2.5 px-5 mb-6">
            <StatCard label="In inventory" value={formatMoney(metrics.activeValue)} sub={`${metrics.activeCount} active item${metrics.activeCount === 1 ? "" : "s"}`} />
            <StatCard label="Revenue" value={formatMoney(metrics.totalRevenue)} sub={`spent ${formatMoney(metrics.totalSpent)}`} />
            <StatCard
              label="Avg. time to sell"
              value={metrics.avgDaysToSell !== null ? `${metrics.avgDaysToSell}d` : "—"}
              sub="buy to sell"
            />
            <StatCard
              label="Best flip"
              value={metrics.bestFlip ? formatMoneySigned(metrics.bestFlipProfit) : "—"}
              sub={metrics.bestFlip?.title ?? "no sales yet"}
              truncateSub
            />
          </section>

          {/* Category breakdown */}
          {metrics.categoryBreakdown.length > 0 && (
            <section className="px-5 mb-6">
              <p className="text-sm text-inkmuted mb-2.5">Profit by category</p>
              <div className="space-y-2">
                {metrics.categoryBreakdown
                  .slice()
                  .sort((a, b) => b.profit - a.profit)
                  .map((c) => {
                    const max = Math.max(...metrics.categoryBreakdown.map((x) => Math.abs(x.profit)), 1);
                    const width = Math.max((Math.abs(c.profit) / max) * 100, 4);
                    return (
                      <div key={c.category} className="flex items-center gap-3">
                        <span className="text-[13px] text-ink w-[86px] shrink-0 truncate">{c.category}</span>
                        <div className="flex-1 h-2 rounded-full bg-hairline overflow-hidden">
                          <div
                            className={`h-full rounded-full ${c.profit >= 0 ? "bg-clay" : "bg-loss"}`}
                            style={{ width: `${width}%` }}
                          />
                        </div>
                        <span className="text-[13px] text-inkmuted w-[58px] text-right shrink-0">
                          {formatMoneySigned(c.profit)}
                        </span>
                      </div>
                    );
                  })}
              </div>
            </section>
          )}

          {/* Monthly trend */}
          {metrics.monthlyTrend.length > 1 && (
            <section className="px-5 mb-6">
              <p className="text-sm text-inkmuted mb-2.5">Monthly profit</p>
              <div className="h-[120px] -ml-2">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={metrics.monthlyTrend}>
                    <XAxis
                      dataKey="month"
                      tickFormatter={monthLabel}
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 11, fill: "#6B6459" }}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(193,97,60,0.08)" }}
                      formatter={(v: number) => [formatMoneySigned(v), "Profit"]}
                      labelFormatter={(l) => monthLabel(l as string)}
                      contentStyle={{
                        background: "#FAF9F4",
                        border: "1px solid #E4DFD1",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                    />
                    <Bar dataKey="profit" radius={[4, 4, 4, 4]}>
                      {metrics.monthlyTrend.map((entry, idx) => (
                        <Cell key={idx} fill={entry.profit >= 0 ? "#C1613C" : "#B3492D"} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>
          )}

          {/* Recent activity */}
          <section>
            <p className="text-sm text-inkmuted px-5 mb-1">Recent activity</p>
            <div className="border-t border-hairline">
              {recent.map((item) => (
                <ItemRow key={item.id} item={item} />
              ))}
            </div>
          </section>
        </>
      )}

      <BottomNav />
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  truncateSub,
}: {
  label: string;
  value: string;
  sub: string;
  truncateSub?: boolean;
}) {
  return (
    <div className="bg-paper border border-hairline rounded-lg px-3.5 py-3">
      <p className="text-[12px] text-inkmuted mb-1">{label}</p>
      <p className="font-serif text-[20px] text-ink font-semibold leading-tight">{value}</p>
      <p className={`text-[12px] text-inkmuted mt-0.5 ${truncateSub ? "truncate" : ""}`}>{sub}</p>
    </div>
  );
}
