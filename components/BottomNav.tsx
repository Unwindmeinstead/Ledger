"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid, PlusCircle, Repeat, Menu } from "lucide-react";

const tabs = [
  { href: "/", label: "Dashboard", icon: LayoutGrid },
  { href: "/log", label: "Log", icon: PlusCircle },
  { href: "/flips", label: "Flips", icon: Repeat },
  { href: "/more", label: "More", icon: Menu },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-[560px] safe-bottom bg-paper/95 backdrop-blur border-t border-hairline">
      <ul className="flex items-stretch justify-between px-2">
        {tabs.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] tracking-tight"
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.3 : 1.8}
                  className={active ? "text-clay" : "text-inkmuted"}
                />
                <span className={active ? "text-clay font-medium" : "text-inkmuted"}>
                  {label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
