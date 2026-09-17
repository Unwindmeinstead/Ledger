"use client";

import { ChevronDown } from "lucide-react";

export default function SelectField({
  value,
  onChange,
  children,
}: {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        className="w-full bg-paper border border-hairline rounded-md pl-3 pr-9 py-2.5 text-[15px] text-ink appearance-none focus:outline-none focus:border-clay truncate"
      >
        {children}
      </select>
      <ChevronDown
        size={16}
        strokeWidth={2}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-inkmuted"
      />
    </div>
  );
}
