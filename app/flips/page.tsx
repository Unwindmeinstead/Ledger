"use client";

import { useEffect, useMemo, useState } from "react";
import { loadItems } from "@/lib/storage";
import { Item, getStatus, ItemStatus } from "@/lib/types";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import EmptyState from "@/components/EmptyState";
import ItemRow from "@/components/ItemRow";

type Filter = "all" | "active" | "sold";

export default function FlipsPage() {
  const [items, setItems] = useState<Item[] | null>(null);
  const [filter, setFilter] = useState<Filter>("all");

  useEffect(() => {
    setItems(loadItems());
  }, []);

  const filtered = useMemo(() => {
    if (!items) return [];
    if (filter === "all") return items;
    return items.filter((it) => {
      const status: ItemStatus = getStatus(it);
      return filter === "active" ? status === "active" : status !== "active";
    });
  }, [items, filter]);

  if (items === null) return null;

  return (
    <div className="pb-28">
      <PageHeader title="Flips" subtitle={`${items.length} item${items.length === 1 ? "" : "s"} logged`} />

      {items.length === 0 ? (
        <EmptyState
          title="No items yet"
          body="Everything you buy and sell will show up here."
          ctaLabel="Log an item"
          ctaHref="/log"
        />
      ) : (
        <>
          <div className="px-5 mb-3 flex gap-2">
            {(["all", "active", "sold"] as Filter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-full text-[13px] capitalize border ${
                  filter === f
                    ? "border-clay text-clay bg-clayTint/40"
                    : "border-hairline text-inkmuted"
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="border-t border-hairline">
            {filtered.map((item) => (
              <ItemRow key={item.id} item={item} />
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-inkmuted text-center py-8">Nothing in this view.</p>
            )}
          </div>
        </>
      )}

      <BottomNav />
    </div>
  );
}
