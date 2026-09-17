"use client";

import { useRef, useState } from "react";
import PageHeader from "@/components/PageHeader";
import BottomNav from "@/components/BottomNav";
import { clearAll, exportItems, importItems, loadItems } from "@/lib/storage";
import { CATEGORIES } from "@/lib/types";
import { Download, Upload, Trash2, Tag } from "lucide-react";

export default function MorePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string | null>(null);

  function handleExport() {
    const json = exportItems();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ledger-export-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImportClick() {
    fileRef.current?.click();
  }

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const result = importItems(String(reader.result));
      if (result.ok) {
        setMessage(`Imported ${result.count} item${result.count === 1 ? "" : "s"}.`);
      } else {
        setMessage(result.error ?? "Import failed.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  }

  function handleClear() {
    if (confirm("Delete all items? This can't be undone.")) {
      clearAll();
      setMessage("All data cleared.");
    }
  }

  const items = loadItems();
  const categoryCounts = CATEGORIES.map((c) => ({
    category: c,
    count: items.filter((it) => it.category === c).length,
  })).filter((c) => c.count > 0);

  return (
    <div className="pb-28">
      <PageHeader title="More" subtitle="Data &amp; settings" />

      {message && (
        <div className="mx-5 mb-4 px-3.5 py-2.5 rounded-md bg-sageTint text-sage text-sm">{message}</div>
      )}

      <section className="px-5 mb-6">
        <p className="text-sm text-inkmuted mb-2.5">Categories in use</p>
        {categoryCounts.length === 0 ? (
          <p className="text-sm text-inkmuted">None yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {categoryCounts.map((c) => (
              <span
                key={c.category}
                className="flex items-center gap-1.5 text-[13px] bg-paper border border-hairline rounded-full px-3 py-1.5 text-ink"
              >
                <Tag size={12} className="text-clay" />
                {c.category}
                <span className="text-inkmuted">{c.count}</span>
              </span>
            ))}
          </div>
        )}
      </section>

      <section className="px-5">
        <p className="text-sm text-inkmuted mb-2.5">Data</p>
        <div className="border border-hairline rounded-lg overflow-hidden bg-paper">
          <button onClick={handleExport} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-hairline">
            <Download size={18} className="text-clay" />
            <span className="text-[15px] text-ink">Export as JSON</span>
          </button>
          <button onClick={handleImportClick} className="w-full flex items-center gap-3 px-4 py-3.5 border-b border-hairline">
            <Upload size={18} className="text-clay" />
            <span className="text-[15px] text-ink">Import from JSON</span>
          </button>
          <button onClick={handleClear} className="w-full flex items-center gap-3 px-4 py-3.5">
            <Trash2 size={18} className="text-loss" />
            <span className="text-[15px] text-loss">Clear all data</span>
          </button>
        </div>
        <input ref={fileRef} type="file" accept="application/json" onChange={handleFile} className="hidden" />
        <p className="text-xs text-inkmuted mt-2.5 leading-relaxed">
          Everything is stored only on this device, in this browser. Export regularly if you want a backup.
        </p>
      </section>

      <section className="px-5 mt-8">
        <p className="text-xs text-inkmuted">Ledger · v1.0</p>
      </section>

      <BottomNav />
    </div>
  );
}
