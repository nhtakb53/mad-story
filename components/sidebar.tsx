"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { AuthButton } from "./auth-button";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, User, Briefcase, FolderKanban, Award, GraduationCap, FileQuestion, FileText, FileCode, LayoutDashboard, UserCircle } from "lucide-react";
import { getCurrentUser } from "@/lib/auth";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const menuItems = [
  {
    title: "대시보드",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "내 정보",
    href: "/profile",
    icon: UserCircle,
  },
  { divider: true },
  {
    title: "기본사항",
    href: "/data/basic",
    icon: User,
  },
  {
    title: "경력",
    href: "/data/career",
    icon: Briefcase,
  },
  {
    title: "프로젝트",
    href: "/data/projects",
    icon: FolderKanban,
  },
  {
    title: "보유기술",
    href: "/data/skills",
    icon: Award,
  },
  {
    title: "학력",
    href: "/data/education",
    icon: GraduationCap,
  },
  {
    title: "기타 사항",
    href: "/data/other-items",
    icon: FileQuestion,
  },
  { divider: true },
  {
    title: "이력서",
    href: "/resume",
    icon: FileText,
  },
  {
    title: "경력기술서",
    href: "/career",
    icon: FileCode,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  return (
    <aside className={cn(
      "flex-shrink-0 border-r bg-background print:hidden transition-[width] duration-300 fixed left-0 top-[65px] bottom-0 z-10",
      isCollapsed ? "w-16" : "w-64"
    )}>
        <div className="flex h-full flex-col">
          {/* User Info & Toggle */}
          <div className="border-b p-3">
            {!isCollapsed && user && (
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  {user.user_metadata?.avatar_url ? (
                    <img
                      src={user.user_metadata.avatar_url}
                      alt={user.user_metadata?.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <UserCircle className="w-5 h-5 text-primary" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {user.user_metadata?.name || user.email}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="p-1.5 rounded-md hover:bg-accent transition-colors flex-shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            )}
            {isCollapsed && user && (
              <div className="relative flex justify-center items-center">
                {user.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt={user.user_metadata?.name || 'User'}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserCircle className="w-6 h-6 text-primary" />
                  </div>
                )}
                <button
                  onClick={() => setIsCollapsed(!isCollapsed)}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 hover:opacity-100 transition-opacity"
                >
                  <ChevronRight className="w-5 h-5 text-white" />
                </button>
              </div>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-0.5">
              {menuItems.map((item, index) => {
                if ('divider' in item && item.divider) {
                  return (
                    <li key={`divider-${index}`} className="py-2">
                      <div className="border-t border-border" />
                    </li>
                  );
                }

                const Icon = item.icon!;
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href!}
                      className={cn(
                        "flex items-center rounded-md px-3 py-2.5 text-sm transition-colors",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground font-medium shadow-sm"
                          : "text-foreground/70 hover:bg-accent hover:text-foreground",
                        isCollapsed ? "justify-center px-2" : "gap-3"
                      )}
                      title={isCollapsed ? item.title : undefined}
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      {!isCollapsed && <span className="whitespace-nowrap">{item.title}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Logout Button */}
          {!isCollapsed && (
            <div className="border-t p-4">
              <AuthButton />
            </div>
          )}
        </div>
    </aside>
  );
}
