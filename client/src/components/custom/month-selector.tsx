import { useEffect, useState } from "react";
import { cn, getCurrentMonth } from "@/lib/utils";
import { monthsArray, monthsShortArray } from "@/lib/types";
import { Calendar, Info } from "lucide-react";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

type SeasonInfo = {
  [key: string]: { description: string; recommended: boolean };
};

const seasonalInfo: SeasonInfo = {
  "January": { 
    description: "Winter months offer unique experiences at parks with snow activities and fewer crowds.", 
    recommended: false 
  },
  "February": { 
    description: "A great time to visit desert parks with mild temperatures and scenic winter views in mountain parks.", 
    recommended: false 
  },
  "March": { 
    description: "Early spring brings wildflower blooms in desert parks and the start of waterfall season in others.", 
    recommended: true 
  },
  "April": { 
    description: "Ideal for visiting many parks as temperatures are mild and crowds are smaller than summer.", 
    recommended: true 
  },
  "May": { 
    description: "Perfect weather in most parks with blooming wildflowers and peak waterfall flows.", 
    recommended: true 
  },
  "June": { 
    description: "Summer begins with longer days, making it ideal for hiking and outdoor activities.", 
    recommended: true 
  },
  "July": { 
    description: "Peak season with warm weather, though crowds can be larger and some areas may be hot.", 
    recommended: true 
  },
  "August": { 
    description: "Late summer offers warm days but can be crowded and hot in some parks.", 
    recommended: false 
  },
  "September": { 
    description: "Fall colors begin in mountain parks with pleasant temperatures and fewer crowds.", 
    recommended: true 
  },
  "October": { 
    description: "Beautiful fall foliage in many parks with comfortable hiking temperatures.", 
    recommended: true 
  },
  "November": { 
    description: "Off-season with fewer crowds, though some higher elevation areas may be closing for winter.", 
    recommended: false 
  },
  "December": { 
    description: "Winter activities begin in mountain parks, while desert parks offer mild temperatures.", 
    recommended: false 
  }
};

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const currentMonth = getCurrentMonth();
  
  return (
    <div className="p-4 border-b border-muted">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-medium text-lg">When are you visiting?</h2>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground">
              <Info className="h-4 w-4" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <div className="space-y-2">
              <h4 className="font-medium">About Park Seasons</h4>
              <p className="text-sm text-muted-foreground">
                Different months offer unique experiences at national parks. The highlighted months are generally recommended for visiting most parks.
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      <div className="flex flex-col space-y-3">
        <div className="grid grid-cols-4 md:grid-cols-6 gap-2">
          {monthsArray.map((month, index) => {
            const isCurrentMonth = month === currentMonth;
            const isRecommended = seasonalInfo[month]?.recommended;
            
            return (
              <button
                key={month}
                className={cn(
                  "relative px-3 py-2 border rounded-md text-center text-sm font-medium transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  selectedMonth === month && "bg-primary text-primary-foreground border-primary",
                  isCurrentMonth && !isRecommended && selectedMonth !== month && "border-orange-300",
                  isRecommended && !isCurrentMonth && selectedMonth !== month && "border-green-300 bg-green-50",
                )}
                onClick={() => onMonthChange(month)}
              >
                {isCurrentMonth && selectedMonth !== month && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-orange-500" />
                )}
                {monthsShortArray[index]}
              </button>
            );
          })}
        </div>
        
        <div className="mt-2 text-sm bg-muted p-3 rounded flex items-start gap-2">
          <Calendar className="h-4 w-4 mt-0.5 flex-shrink-0" />
          <p>
            <span className="font-medium">{selectedMonth}:</span> {' '}
            {seasonalInfo[selectedMonth]?.description || 
              "A great time to visit select National Parks with varying seasonal conditions."}
          </p>
        </div>
      </div>
    </div>
  );
}
