import { Item } from "./types";

const KEY = "ledger.items.v1";

export function loadItems(): Item[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveItems(items: Item[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(items));
}

export function addItem(item: Item) {
  const items = loadItems();
  items.unshift(item);
  saveItems(items);
  return items;
}

export function updateItem(id: string, patch: Partial<Item>) {
  const items = loadItems();
  const next = items.map((it) => (it.id === id ? { ...it, ...patch } : it));
  saveItems(next);
  return next;
}

export function deleteItem(id: string) {
  const items = loadItems().filter((it) => it.id !== id);
  saveItems(items);
  return items;
}

export function exportItems(): string {
  return JSON.stringify(loadItems(), null, 2);
}

export function importItems(json: string): { ok: boolean; count?: number; error?: string } {
  try {
    const parsed = JSON.parse(json);
    if (!Array.isArray(parsed)) return { ok: false, error: "File is not a list of items." };
    saveItems(parsed);
    return { ok: true, count: parsed.length };
  } catch (e) {
    return { ok: false, error: "Could not parse that file." };
  }
}

export function clearAll() {
  saveItems([]);
}

export function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}
