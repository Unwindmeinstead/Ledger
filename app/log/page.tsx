"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import { CATEGORIES, Category, PLATFORMS, Platform, Item, getStatus } from "@/lib/types";
import { addItem, loadItems, newId, updateItem } from "@/lib/storage";
import { todayIso } from "@/lib/format";
import SelectField from "@/components/SelectField";

type EntryType = "buy" | "sell";

export default function LogPage() {
  const router = useRouter();
  const [entryType, setEntryType] = useState<EntryType>("buy");
  const [sellMode, setSellMode] = useState<"link" | "general">("link");

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<Category>("Other");
  const [platform, setPlatform] = useState<Platform>("Facebook Marketplace");
  const [date, setDate] = useState(todayIso());
  const [price, setPrice] = useState("");
  const [notes, setNotes] = useState("");
  const [linkedId, setLinkedId] = useState<string>("");
  const [saved, setSaved] = useState(false);

  const activeItems = useMemo(
    () => loadItems().filter((it) => getStatus(it) === "active"),
    [saved]
  );

  useEffect(() => {
    if (entryType === "sell" && sellMode === "link" && activeItems.length > 0 && !linkedId) {
      setLinkedId(activeItems[0].id);
    }
  }, [entryType, sellMode, activeItems, linkedId]);

  function reset() {
    setTitle("");
    setCategory("Other");
    setPlatform("Facebook Marketplace");
    setDate(todayIso());
    setPrice("");
    setNotes("");
    setLinkedId("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const numericPrice = parseFloat(price || "0");

    if (entryType === "buy") {
      const item: Item = {
        id: newId(),
        title: title.trim() || "Untitled item",
        category,
        platform,
        buyDate: date,
        buyPrice: numericPrice,
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      addItem(item);
    } else if (sellMode === "link" && linkedId) {
      updateItem(linkedId, {
        sellDate: date,
        sellPrice: numericPrice,
        notes: notes.trim() || undefined,
      });
    } else {
      const item: Item = {
        id: newId(),
        title: title.trim() || "Untitled sale",
        category,
        platform,
        sellDate: date,
        sellPrice: numericPrice,
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString(),
      };
      addItem(item);
    }

    setSaved(true);
    reset();
    router.push("/");
  }

  return (
    <div className="pb-28">
      <PageHeader title="Log" subtitle="Add a buy or a sell" />

      {/* Buy / Sell toggle */}
      <div className="px-5 mb-5">
        <div className="grid grid-cols-2 bg-hairline/50 rounded-md p-1">
          {(["buy", "sell"] as EntryType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setEntryType(t)}
              className={`py-2 rounded-sm text-sm font-medium capitalize transition-colors ${
                entryType === t ? "bg-paper text-ink shadow-card" : "text-inkmuted"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="px-5 space-y-5">
        {entryType === "sell" && (
          <div>
            <label className="text-sm text-inkmuted block mb-1.5">What are you selling?</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSellMode("link")}
                disabled={activeItems.length === 0}
                className={`py-2 rounded-md text-sm border ${
                  sellMode === "link"
                    ? "border-clay text-clay bg-clayTint/40"
                    : "border-hairline text-inkmuted"
                } disabled:opacity-40`}
              >
                Something I bought
              </button>
              <button
                type="button"
                onClick={() => setSellMode("general")}
                className={`py-2 rounded-md text-sm border ${
                  sellMode === "general"
                    ? "border-clay text-clay bg-clayTint/40"
                    : "border-hairline text-inkmuted"
                }`}
              >
                General sale
              </button>
            </div>
            {activeItems.length === 0 && sellMode === "link" && (
              <p className="text-xs text-inkmuted mt-1.5">
                Nothing in inventory yet — log a buy first, or use a general sale.
              </p>
            )}
          </div>
        )}

        {entryType === "sell" && sellMode === "link" ? (
          <Field label="Item">
            <SelectField value={linkedId} onChange={(e) => setLinkedId(e.target.value)}>
              {activeItems.map((it) => (
                <option key={it.id} value={it.id}>
                  {it.title} — bought ${it.buyPrice}
                </option>
              ))}
            </SelectField>
          </Field>
        ) : (
          <Field label="Description">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={entryType === "buy" ? "e.g. Specialized Rockhopper" : "e.g. Old kitchen table"}
              className={inputClass}
            />
          </Field>
        )}

        {!(entryType === "sell" && sellMode === "link") && (
          <div className="space-y-4">
            <Field label="Category">
              <SelectField value={category} onChange={(e) => setCategory(e.target.value as Category)}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </SelectField>
            </Field>
            <Field label="Platform">
              <SelectField value={platform} onChange={(e) => setPlatform(e.target.value as Platform)}>
                {PLATFORMS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </SelectField>
            </Field>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Field label={entryType === "buy" ? "Date bought" : "Date sold"}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label={entryType === "buy" ? "Price paid" : "Sale price"}>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-inkmuted text-[15px]">$</span>
              <input
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0"
                className={`${inputClass} pl-6`}
              />
            </div>
          </Field>
        </div>

        <Field label="Notes (optional)">
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            placeholder="Condition, buyer, pickup details..."
            className={`${inputClass} resize-none`}
          />
        </Field>

        <button
          type="submit"
          disabled={entryType === "sell" && sellMode === "link" && activeItems.length === 0}
          className="w-full bg-clay text-paper font-medium py-3 rounded-md active:bg-clayDeep disabled:opacity-40 mt-2"
        >
          {entryType === "buy" ? "Save buy" : "Save sell"}
        </button>
      </form>

      <BottomNav />
    </div>
  );
}

const inputClass =
  "w-full bg-paper border border-hairline rounded-md px-3 py-2.5 text-[15px] text-ink placeholder:text-inkmuted/70 focus:outline-none focus:border-clay";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-inkmuted block mb-1.5">{label}</span>
      {children}
    </label>
  );
}
