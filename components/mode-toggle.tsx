"use client";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { Sun, Moon, Palette, ChevronDown } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const THEMES = [
  { value: "light", label: "Ember Light", icon: Sun, color: "bg-[#e8440a]" },
  { value: "dark", label: "Ember Dark", icon: Moon, color: "bg-[#ff6b3d]" },
  { value: "teal", label: "Teal Light", icon: Sun, color: "bg-[#009FAB]" },
  { value: "teal-dark", label: "Teal Dark", icon: Moon, color: "bg-[#33ccd6]" },
] as const;

export function ModeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mount, setMount] = useState<boolean>(false);

  // this is needed to avoid hydration mismatch, because the theme is determined on the client side
  // just ignore this, it works fine and is a common pattern for theme toggles in Next.js
  useEffect(() => {
    setMount(true);
  }, []);

  // render nothing on the server, then render the dropdown on the client when the theme is available
  if (!mount) return null;

  const current = THEMES.find((t) => t.value === theme) ?? THEMES[0];
  const CurrentIcon = current.icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          className={cn(
            "inline-flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-2.5 text-foreground transition-all hover:bg-accent hover:shadow-sm",
            className,
          )}
          aria-label="Select theme"
        >
          <CurrentIcon className="h-4 w-4" />
          <ChevronDown className="h-3 w-3 opacity-50" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <div className="px-2 py-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Palette className="h-3 w-3" />
            Theme
          </p>
        </div>
        <DropdownMenuSeparator />
        {THEMES.map(({ value, label, color }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className={cn(
              "flex cursor-pointer items-center gap-2.5 rounded-md",
              theme === value && "bg-accent font-semibold",
            )}
          >
            <span className={cn("h-2.5 w-2.5 rounded-full", color)} />
            {/* <Icon className="h-3.5 w-3.5" /> */}
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
