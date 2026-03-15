"use client";

import { useEffect, type ElementType, useMemo } from "react";
import { PaymentMethodsTable } from "@/components/dashboard/settings/payment-methods";
import { ReviewTypesTable } from "@/components/dashboard/settings/review-types";
import { ProfilesTable } from "@/components/dashboard/settings/profiles-table";
import UpdateInformation from "@/components/dashboard/settings/update-information";
import { cn } from "@/lib/utils";
import { CreditCard, ClipboardList, Users } from "lucide-react";
import {
  useSettingsStore,
  type SettingsTab,
} from "@/features/store/settings/useSettingStore";
import { useAuth } from "@/components/auth-provider";

type Array = {
  id: SettingsTab;
  label: string;
  icon: ElementType;
  description: string;
};

const tabs: Array[] = [
  {
    id: "payment-methods",
    label: "Payment Methods",
    icon: CreditCard,
    description: "Manage accepted payment types",
  },
  {
    id: "review-types",
    label: "Review Types",
    icon: ClipboardList,
    description: "Configure service review categories",
  },
  {
    id: "profiles",
    label: "VA Accounts",
    icon: Users,
    description: "View all registered profiles",
  },
  {
    id: "update-information",
    label: "Update Login Information",
    icon: Users,
    description: "Change password",
  },
];

export default function SettingsPage() {
  const { activeTab, setActiveTab } = useSettingsStore();
  const { role } = useAuth();
  const isAdmin = role === "company" || role === "super_admin";

  const visibleTabs = useMemo(() => {
    return tabs.filter((tab) => {
      if (
        tab.id === "payment-methods" ||
        tab.id === "review-types" ||
        tab.id === "profiles"
      ) {
        return isAdmin;
      }
      return true;
    });
  }, [isAdmin]);

  useEffect(() => {
    if (
      visibleTabs.length > 0 &&
      !visibleTabs.find((t) => t.id === activeTab)
    ) {
      setActiveTab(visibleTabs[0].id);
    }
  }, [visibleTabs, activeTab, setActiveTab]);

  return (
    <div className="space-y-4 px-2 sm:px-0">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          {isAdmin
            ? "Manage your business configuration"
            : "Update your login information here"}
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Sidebar / Tab bar */}
        <nav
          className="
          flex flex-row sm:flex-col
          gap-1
          sm:w-52 shrink-0
          overflow-x-auto sm:overflow-x-visible
          pb-1 sm:pb-0
          -mx-2 px-2 sm:mx-0 sm:px-0
          scrollbar-none
        "
        >
          {visibleTabs.map(({ id, label, icon: Icon, description }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors shrink-0 sm:shrink sm:w-full",
                activeTab === id
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {/* Mobile: icon + short label, no description */}
              <span className="sm:hidden font-medium whitespace-nowrap">
                {label}
              </span>
              {/* Desktop: full label + description */}
              <span className="hidden sm:block">
                <span className="block font-medium leading-tight">{label}</span>
                <span className="block text-xs text-muted-foreground/70 leading-tight mt-0.5">
                  {description}
                </span>
              </span>
            </button>
          ))}
        </nav>

        {/* Content panel */}
        <div className="flex-1 min-w-0 overflow-x-auto">
          {activeTab === "payment-methods" && <PaymentMethodsTable />}
          {activeTab === "review-types" && <ReviewTypesTable />}
          {activeTab === "profiles" && <ProfilesTable />}
          {activeTab === "update-information" && <UpdateInformation />}
        </div>
      </div>
    </div>
  );
}
