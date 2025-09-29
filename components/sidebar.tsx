"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  LayoutDashboard,
  Users,
  MessageSquareWarning,
  Building2,
} from "lucide-react";

const navigation = [
  {
    name: "Dashboard",
    href: "/",
    icon: LayoutDashboard,
  },
  {
    name: "Users",
    href: "/users",
    icon: Users,
  },
  {
    name: "Complaints",
    href: "/complaints",
    icon: MessageSquareWarning,
  },
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div
      className={cn(
        "flex h-full w-64 flex-col bg-[#152030] border-r border-[#1e2d40]",
        className
      )}
    >
      {/* Header */}
      <div className="flex h-20 items-center px-6 border-b border-[#1e2d40]">
        <div className="flex items-center gap-3">
          <Building2 className="h-9 w-9 text-white/90" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-white/90">Kraft</span>
            <span className="text-sm text-white/60">Mobility</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="space-y-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={isActive ? "default" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-4 h-14 text-lg font-medium transition-all duration-200",
                    isActive
                      ? "bg-white/10 text-white hover:bg-white/15"
                      : "text-white/70 hover:bg-white/5 hover:text-white"
                  )}
                >
                  <item.icon className="h-6 w-6 flex-shrink-0" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t border-[#1e2d40] p-6">
        <div className="text-sm text-white/50 text-center">
          Admin Dashboard v1.0
        </div>
      </div>
    </div>
  );
}
