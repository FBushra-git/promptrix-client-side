"use client";

import { useSession } from "@/lib/auth-client";
import {
  House,
  Magnifier,
  Copy,
  Bookmark,
  Gear,
  Plus,
  Layers,
  Person,
  CreditCard,
  ChartColumn,
  Flag,
} from "@gravity-ui/icons";
import { Avatar } from "@heroui/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function DashboardSidebar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const user = session?.user;
  const role = user?.role?.toLowerCase() || "user";
  console.log({role})

  const adminNavLinks = [
    { icon: House, href: "/dashboard/admin", label: "Dashboard" },
    { icon: Person, href: "/dashboard/admin/users", label: "All Users" },
    { icon: Layers, href: "/dashboard/admin/prompts", label: "All Prompts" },
    { icon: CreditCard, href: "/dashboard/admin/payments", label: "Payments" },
    { icon: Flag, href: "/dashboard/admin/reports", label: "Reports" },
    { icon: ChartColumn, href: "/dashboard/admin/analytics", label: "Analytics" },
    { icon: Gear, href: "/settings", label: "Settings" },
  ];

  const creatorNavLinks = [
    { icon: House, href: "/dashboard/creator", label: "Dashboard" },
    { icon: Person, href: "/dashboard/creator/profile", label: "Profile" },
    { icon: Plus, href: "/dashboard/creator/prompts/add-prompt", label: "Add Prompt" },
    { icon: Layers, href: "/dashboard/creator/prompts", label: "My Prompts" },
    { icon: Copy, href: "/dashboard/creator/analytics", label: "Analytics" },
    { icon: Gear, href: "/settings", label: "Settings" },
  ];

  const userNavLinks = [
    { icon: House, href: "/dashboard/user", label: "Dashboard" },
    { icon: Magnifier, href: "/prompts", label: "Browse Prompts" },
    { icon: Plus, href: "/dashboard/user/add-prompt", label: "Add Prompt" },
    { icon: Layers, href: "/dashboard/user/my-prompts", label: "My Prompts" },
    { icon: Bookmark, href: "/dashboard/user/saved-prompts", label: "Saved Prompts" },
    { icon: Copy, href: "/dashboard/user/my-reviews", label: "My Reviews" },
    { icon: Person, href: "/dashboard/user/profile", label: "Profile" },
    { icon: Gear, href: "/settings", label: "Settings" },
  ];

  const navItems =
    role === "admin"
      ? adminNavLinks
      : role === "creator"
        ? creatorNavLinks
        : userNavLinks;

  const isActive = (href) => {
    if (href === "/dashboard/admin") return pathname === href;
    if (href === "/dashboard/creator") return pathname === href;
    if (href === "/dashboard/user") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside
      suppressHydrationWarning
      className="hidden h-screen w-64 shrink-0 sticky top-0 border-r border-white/5 p-4 backdrop-blur-xl lg:block"
    >
      <div className="mb-8 flex items-center gap-3 rounded-2xl p-3 transition-colors hover:bg-white/5">
        <Avatar
          src={user?.image}
          name={user?.name || "User"}
          className="h-10 w-10 border-2 border-purple-500/20"
        />

        <div className="flex min-w-0 flex-col" suppressHydrationWarning>
          <span
            suppressHydrationWarning
            className="truncate text-sm font-bold text-white"
          >
            {user?.name || "User"}
          </span>

          <span
            suppressHydrationWarning
            className="text-[10px] font-bold uppercase tracking-widest text-purple-400"
          >
            {role === "admin"
              ? "ADMIN MODE"
              : role === "creator"
                ? "CREATOR MODE"
                : "MEMBER"}
          </span>
        </div>
      </div>

      <nav className="flex flex-col gap-1.5 p-2">
        {navItems.map((item) => {
          const active = isActive(item.href);

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm transition-all duration-300 ${
                active
                  ? "bg-[#967bb6]/20 text-white shadow-lg shadow-[#967bb6]/10"
                  : "text-neutral-400 hover:bg-white/5 hover:pl-6 hover:text-white"
              }`}
            >
              <item.icon
                className={`size-5 transition-colors ${
                  active ? "text-purple-300" : "group-hover:text-purple-400"
                }`}
              />

              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}