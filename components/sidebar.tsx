"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const mainMenuItems = [
  {
    title: "이력서",
    href: "/resume",
  },
  {
    title: "경력기술서",
    href: "/career",
  },
];

const dataMenuItems = [
  {
    title: "기본사항",
    href: "/data/basic",
  },
  {
    title: "경력",
    href: "/data/career",
  },
  {
    title: "보유기술",
    href: "/data/skills",
  },
  {
    title: "학력",
    href: "/data/education",
  },
  {
    title: "프로젝트",
    href: "/data/projects",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-background">
      <div className="flex h-full flex-col">
        <div className="border-b p-6">
          <h1 className="text-xl font-bold">개발자 이력</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="mb-6">
            <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
              문서
            </h2>
            <ul className="space-y-1">
              {mainMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="mb-2 px-4 text-xs font-semibold text-muted-foreground">
              데이터 입력
            </h2>
            <ul className="space-y-1">
              {dataMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "block rounded-lg px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                      pathname === item.href
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>
    </aside>
  );
}
