import { useState } from "react";
import { cn } from "@/lib/utils";

interface MobileNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function MobileNav({ activeTab, onTabChange }: MobileNavProps) {
  const tabs = [
    { id: "map", icon: "bx-map", label: "Map" },
    { id: "parks", icon: "bx-list-ul", label: "Parks" },
    { id: "months", icon: "bx-calendar", label: "Months" },
    { id: "ai", icon: "bx-bulb", label: "AI Suggest" },
  ];
  
  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-primary text-white z-20">
      <div className="flex justify-around py-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={cn(
              "flex flex-col items-center px-3 py-1",
              activeTab === tab.id && "text-accent"
            )}
            onClick={() => onTabChange(tab.id)}
          >
            <i className={`bx ${tab.icon} text-2xl`}></i>
            <span className="text-xs">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
