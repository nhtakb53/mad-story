"use client";

import { ReactNode } from "react";

interface TopHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
}

export function TopHeader({ title, description, actions }: TopHeaderProps) {
  return (
    <div className="border-b bg-background print:hidden fixed top-0 left-0 right-0 z-20 backdrop-blur-sm bg-white/95 dark:bg-gray-950/95 h-[65px]">
      <div className="flex items-center justify-between px-6 h-full">
        <div className="flex items-center gap-6">
          <h1 className="text-xl font-bold">MadStory</h1>
          <div className="border-l pl-6">
            <h2 className="text-lg font-semibold">{title}</h2>
          </div>
        </div>
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
