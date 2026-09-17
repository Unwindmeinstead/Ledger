"use client";

import { Item, getProfit, getStatus } from "@/lib/types";
import { formatDate, formatMoney, formatMoneySigned } from "@/lib/format";
import Link from "next/link";

const statusStyle: Record<string, string> = {
  active: "bg-slateTint text-slate",
  sold: "bg-sageTint text-sage",
  "logged-sale": "bg-sageTint text-sage",
};

const statusLabel: Record<string, string> = {
  active: "In inventory",
  sold: "Sold",
  "logged-sale": "Sold",
};

export default function ItemRow({ item }: { item: Item }) {
  const status = getStatus(item);
  const profit = getProfit(item);

  return (
    <Link
      href={`/item/${item.id}`}
      className="flex items-center justify-between gap-3 px-5 py-3.5 border-b border-hairline active:bg-paper/70"
    >
      <div className="min-w-0">
        <p className="text-[15px] text-ink font-medium truncate">{item.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-[11px] px-1.5 py-0.5 rounded-sm ${statusStyle[status]}`}>
            {statusLabel[status]}
          </span>
          <span className="text-[12px] text-inkmuted">{item.category}</span>
          <span className="text-[12px] text-inkmuted">
            &middot; {formatDate(item.sellDate ?? item.buyDate)}
          </span>
        </div>
      </div>
      <div className="text-right shrink-0">
        {profit !== null ? (
          <p className={`text-[15px] font-medium ${profit >= 0 ? "text-sage" : "text-loss"}`}>
            {formatMoneySigned(profit)}
          </p>
        ) : (
          <p className="text-[15px] font-medium text-inkmuted">{formatMoney(item.buyPrice ?? 0)}</p>
        )}
        <p className="text-[11px] text-inkmuted">{profit !== null ? "profit" : "cost"}</p>
      </div>
    </Link>
  );
}
