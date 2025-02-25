import { useState } from "react";
import { cn } from "@/lib/utils";
import { monthsArray, monthsShortArray } from "@/lib/types";

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  return (
    <div className="p-4 border-b border-accent">
      <h2 className="font-montserrat font-semibold text-lg mb-3">When are you visiting?</h2>
      <div className="flex flex-col space-y-2">
        <div className="grid grid-cols-3 gap-2">
          {monthsArray.map((month, index) => (
            <button
              key={month}
              className={cn(
                "px-3 py-2 border rounded-md text-center text-sm font-montserrat font-medium hover:bg-lightAccent transition-colors",
                selectedMonth === month && "active bg-selected border-primary"
              )}
              onClick={() => onMonthChange(month)}
            >
              {monthsShortArray[index]}
            </button>
          ))}
        </div>
        <div className="mt-2 text-sm bg-lightAccent p-3 rounded">
          <p className="font-opensans">
            <span className="font-semibold">{selectedMonth}</span> {' '}
            {selectedMonth === "May" 
              ? "offers ideal conditions for most National Parks with mild temperatures and blooming wildflowers." 
              : "is a great time to visit select National Parks with varying seasonal conditions."}
          </p>
        </div>
      </div>
    </div>
  );
}
