"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Map, List, Activity, User as UserIcon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

import { User } from "next-auth";

export default function NavBar({ user, isAdmin }: { user?: User | null, isAdmin?: boolean }) {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);

  const navItems = [
    { name: "Map", href: "/gym", icon: Map },
    { name: "Routes", href: "/routes", icon: List },
    { name: "Feed", href: "/feed", icon: Activity },
    ...(user ? [{ name: "Profile", href: "/profile", icon: UserIcon }] : []),
    ...(isAdmin ? [{ name: "Admin", href: "/admin", icon: Settings }] : []),
  ];

  // Determine active item (handle sub-routes if needed, e.g. /profile/123)
  const activeItem = navItems.find(item => 
    pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
  ) || navItems[0];

  return (
    <nav className="fixed bottom-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div className="pointer-events-auto bg-black text-white flex items-center p-1 shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)] border-2 border-white/10 transform -skew-x-6">
        {navItems.map((item) => {
          const isActive = activeItem.href === item.href;
          const isHovered = hoveredPath === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              onMouseEnter={() => setHoveredPath(item.href)}
              onMouseLeave={() => setHoveredPath(null)}
              className={cn(
                "relative px-6 py-3 flex flex-col items-center justify-center gap-1 transition-all duration-300 group",
                isActive ? "text-black" : "text-slate-400 hover:text-white"
              )}
            >
              {/* Active Background Block */}
              {isActive && (
                <div className="absolute inset-0 bg-yellow-400 transform skew-x-6 z-0" />
              )}
              
              {/* Hover Outline */}
              {!isActive && isHovered && (
                <div className="absolute inset-0 border-2 border-white/20 transform skew-x-6 z-0" />
              )}

              {/* Icon & Label */}
              <div className="relative z-10 flex flex-col items-center transform skew-x-6">
                <item.icon className={cn("w-5 h-5", isActive && "stroke-[2.5px]")} />
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-widest mt-1",
                  isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"
                )}>
                  {item.name}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
