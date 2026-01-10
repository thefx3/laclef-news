"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PenSquare, Archive, Users } from "lucide-react";
import { useAuth } from "./AuthGate";

type LinkItem = {
  href: string;
  label: string;
  icon: "home" | "pen" | "archive" | "users";
};

type Props = {
  links: LinkItem[];
  className?: string;
  linkBaseClass: string;
};

export function HeaderNav({ links, className, linkBaseClass }: Props) {
  const pathname = usePathname();
  const { isGuest } = useAuth();

  const activeClass =
    "bg-[linear-gradient(100deg,_#D2F3FC,_#FACFCE)] text-gray-900";

  const iconMap = {
    home: Home,
    pen: PenSquare,
    archive: Archive,
    users: Users,
  };

  return (
    <nav className={className}>
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname?.startsWith(link.href);

        const Icon = iconMap[link.icon];
        const isBlocked = isGuest && link.href !== "/";
        return (
          <Link
            key={link.href}
            href={isBlocked ? "#" : link.href}
            className={`${linkBaseClass} ${
              isActive ? activeClass : "text-gray-700"
            } inline-flex items-center gap-2 ${
              isBlocked ? "opacity-40 pointer-events-none" : ""
            }`}
            aria-current={isActive ? "page" : undefined}
            aria-disabled={isBlocked ? true : undefined}
          >
            <Icon className="h-4 w-4" aria-hidden />
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
