"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import { CATEGORIES, Category, PLATFORMS, Platform, Item, getProfit, getRoi, getDaysToSell, getStatus } from "@/lib/types";
import { deleteItem, loadItems, updateItem } from "@/lib/storage";
import { formatMoneySigned, todayIso } from "@/lib/format";
import { ChevronLeft, Trash2 } from "lucide-react";
import Link from "next/link";

export default function ItemDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [item, setItem] = useState<Item | null | undefined>(undefined);
  const [markingSold, setMarkingSold] = useState(false);
  const [sellDate, setSellDate] = useState(todayIso());
  const [sellPrice, setSellPrice] = useState("");

  useEffect(() => {
    const found = loadItems().find((it) => it.id === id);
    setItem(found ?? null);
  }, [id]);

  if (item === undefined) return null;
  if (item === null) {
    return (
      <div className="pb-28">
        <PageHeader title="Not found" />
        <p className="px-5 text-sm text-inkmuted">This item may have been deleted.</p>
        <BottomNav />
      </div>
    );
  }

  const status = getStatus(item);
  const profit = getProfit(item);
  const roi = getRoi(item);
  const days = getDaysToSell(item);

  function handleField<K extends keyof Item>(key: K, value: Item[K]) {
    if (!item) return;
    const updated = { ...item, [key]: value };
    setItem(updated);
    updateItem(item.id, { [key]: value } as Partial<Item>);
  }

  function confirmSold(e: React.FormEvent) {
    e.preventDefault();
    if (!item) return;
    const price = parseFloat(sellPrice || "0");
    updateItem(item.id, { sellDate, sellPrice: price });
    setItem({ ...item, sellDate, sellPrice: price });
    setMarkingSold(false);
  }

  function handleDelete() {
    if (!item) return;
    if (confirm("Delete this item? This can't be undone.")) {
      deleteItem(item.id);
      router.push("/flips");
    }
  }

  return (
    <div className="pb-28">
      <div className="safe-top px-5 pt-6 pb-2 flex items-center justify-between">
        <Link href="/flips" className="flex items-center gap-0.5 text-inkmuted text-sm">
          <ChevronLeft size={18} />
          Flips
        </Link>
        <button onClick={handleDelete} className="text-loss">
          <Trash2 size={18} />
        </button>
      </div>

      <div className="px-5 pt-3 pb-5">
        <input
          value={item.title}
          onChange={(e) => handleField("title", e.target.value)}
          className="font-serif text-[24px] font-semibold text-ink w-full bg-transparent focus:outline-none"
        />
        <span
          className={`inline-block mt-1.5 text-[11px] px-1.5 py-0.5 rounded-sm ${
            status === "active" ? "bg-slateTint text-slate" : "bg-sageTint text-sage"
          }`}
        >
          {status === "active" ? "In inventory" : "Sold"}
        </span>
      </div>

      {profit !== null && (
        <div className="px-5 mb-5 grid grid-cols-2 gap-2.5">
          <MiniStat label="Profit" value={formatMoneySigned(profit)} tone={profit >= 0 ? "good" : "bad"} />
          <MiniStat label="ROI" value={roi !== null ? `${roi >= 0 ? "+" : ""}${roi.toFixed(0)}%` : "—"} tone={roi !== null && roi >= 0 ? "good" : "bad"} />
          {days !== null && <MiniStat label="Days to sell" value={`${days}d`} />}
        </div>
      )}

      <div className="px-5 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Category">
            <select
              value={item.category}
              onChange={(e) => handleField("category", e.target.value as Category)}
              className={selectClass}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Platform">
            <select
              value={item.platform}
              onChange={(e) => handleField("platform", e.target.value as Platform)}
              className={selectClass}
            >
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Date bought">
            <input
              type="date"
              value={item.buyDate ?? ""}
              onChange={(e) => handleField("buyDate", e.target.value)}
              className={inputClass}
            />
          </Field>
          <Field label="Price paid">
            <PriceInput value={item.buyPrice} onChange={(v) => handleField("buyPrice", v)} />
          </Field>
        </div>

        {item.sellDate ? (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Date sold">
              <input
                type="date"
                value={item.sellDate ?? ""}
                onChange={(e) => handleField("sellDate", e.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Sale price">
              <PriceInput value={item.sellPrice} onChange={(v) => handleField("sellPrice", v)} />
            </Field>
          </div>
        ) : markingSold ? (
          <form onSubmit={confirmSold} className="border border-hairline rounded-md p-3.5 space-y-3 bg-paper">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Date sold">
                <input type="date" value={sellDate} onChange={(e) => setSellDate(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Sale price">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-inkmuted text-[15px]">$</span>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={sellPrice}
                    onChange={(e) => setSellPrice(e.target.value)}
                    className={`${inputClass} pl-6`}
                    placeholder="0"
                  />
                </div>
              </Field>
            </div>
            <button type="submit" className="w-full bg-clay text-paper font-medium py-2.5 rounded-md active:bg-clayDeep">
              Confirm sold
            </button>
          </form>
        ) : (
          <button
            onClick={() => setMarkingSold(true)}
            className="w-full border border-clay text-clay font-medium py-2.5 rounded-md active:bg-clayTint/40"
          >
            Mark as sold
          </button>
        )}

        <Field label="Notes">
          <textarea
            value={item.notes ?? ""}
            onChange={(e) => handleField("notes", e.target.value)}
            rows={3}
            className={`${inputClass} resize-none`}
            placeholder="Condition, buyer, pickup details..."
          />
        </Field>
      </div>

      <BottomNav />
    </div>
  );
}

function PriceInput({ value, onChange }: { value?: number; onChange: (v: number) => void }) {
  return (
    <div className="relative">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-inkmuted text-[15px]">$</span>
      <input
        type="number"
        inputMode="decimal"
        value={value ?? ""}
        onChange={(e) => onChange(parseFloat(e.target.value || "0"))}
        className={`${inputClass} pl-6`}
        placeholder="0"
      />
    </div>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: "good" | "bad" }) {
  const color = tone === "good" ? "text-sage" : tone === "bad" ? "text-loss" : "text-ink";
  return (
    <div className="bg-paper border border-hairline rounded-lg px-3 py-2.5">
      <p className="text-[11px] text-inkmuted mb-0.5">{label}</p>
      <p className={`font-serif text-[17px] font-semibold ${color}`}>{value}</p>
    </div>
  );
}

const inputClass =
  "w-full bg-paper border border-hairline rounded-md px-3 py-2.5 text-[15px] text-ink placeholder:text-inkmuted/70 focus:outline-none focus:border-clay";
const selectClass = `${inputClass} appearance-none`;

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="text-sm text-inkmuted block mb-1.5">{label}</span>
      {children}
    </label>
  );
}
