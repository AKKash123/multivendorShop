
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Store,
  Heart,
  ShoppingBag,
  UserRound,
} from "lucide-react";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Shop",
    href: "/products",
    icon: Store,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingBag,
  },
  {
    label: "Account",
    href: "/account",
    icon: UserRound,
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
      {navItems.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/"
            ? pathname === "/"
            : pathname === href || pathname.startsWith(`${href}/`);

        return (
          <Link
            key={href}
            href={href}
            className={`bottom-nav-item ${active ? "active" : ""}`}
            aria-current={active ? "page" : undefined}
          >
            <span className="bottom-nav-icon">
              <Icon size={21} strokeWidth={active ? 2.5 : 1.9} />
            </span>

            <span className="bottom-nav-label">
              {label}
            </span>

            {active && (
              <span className="bottom-nav-indicator" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
