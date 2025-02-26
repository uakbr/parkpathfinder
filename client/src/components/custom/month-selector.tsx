import { useEffect, useState } from "react";
import { cn, getCurrentMonth } from "@/lib/utils";
import { monthsArray, monthsShortArray, type Month } from "@/lib/types";
import { Calendar, Info, CheckCircle2 } from "lucide-react";
import { 
  HoverCard, 
  HoverCardContent, 
  HoverCardTrigger 
} from "@/components/ui/hover-card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";

interface MonthSelectorProps {
  selectedMonth: string;
  onMonthChange: (month: string) => void;
}

type SeasonInfo = {
  [key: string]: { 
    description: string; 
    recommended: boolean;
    season: string;
  };
};

const seasonalInfo: SeasonInfo = {
  "January": { 
    description: "Winter months offer unique experiences with snow activities and fewer crowds.", 
    recommended: false,
    season: "winter"
  },
  "February": { 
    description: "Great for desert parks with mild temperatures, scenic winter views in mountains.", 
    recommended: false,
    season: "winter"
  },
  "March": { 
    description: "Early spring brings wildflower blooms in deserts and waterfall season begins.", 
    recommended: true,
    season: "spring" 
  },
  "April": { 
    description: "Ideal visiting time with mild temperatures and smaller crowds than summer.", 
    recommended: true,
    season: "spring"
  },
  "May": { 
    description: "Perfect weather with blooming wildflowers and peak waterfall flows.", 
    recommended: true,
    season: "spring"
  },
  "June": { 
    description: "Longer days make it ideal for hiking and outdoor activities.", 
    recommended: true,
    season: "summer"
  },
  "July": { 
    description: "Peak season with warm weather, though crowds are larger in popular parks.", 
    recommended: true,
    season: "summer"
  },
  "August": { 
    description: "Late summer offers warm days but can be crowded and hot in some areas.", 
    recommended: false,
    season: "summer"
  },
  "September": { 
    description: "Fall colors begin in mountain parks with pleasant temperatures.", 
    recommended: true,
    season: "fall"
  },
  "October": { 
    description: "Beautiful fall foliage with comfortable hiking temperatures.", 
    recommended: true,
    season: "fall"
  },
  "November": { 
    description: "Fewer crowds, though higher elevation areas may close for winter.", 
    recommended: false,
    season: "fall"
  },
  "December": { 
    description: "Winter activities in mountain parks, mild temps in desert parks.", 
    recommended: false,
    season: "winter"
  }
};

// Group months by season for the mobile view
const seasonGroups = {
  winter: ["December", "January", "February"],
  spring: ["March", "April", "May"],
  summer: ["June", "July", "August"],
  fall: ["September", "October", "November"]
};

export function MonthSelector({ selectedMonth, onMonthChange }: MonthSelectorProps) {
  const currentMonth = getCurrentMonth();
  const isMobile = useIsMobile();
  const [activeSeason, setActiveSeason] = useState(() => {
    // Set initial active season based on selected month
    return seasonalInfo[selectedMonth]?.season || "spring";
  });
  
  // Update active season when selected month changes
  useEffect(() => {
    setActiveSeason(seasonalInfo[selectedMonth]?.season || "spring");
  }, [selectedMonth]);
  
  const getMonthButton = (month: Month, index: number) => {
    const isCurrentMonth = month === currentMonth;
    const isRecommended = seasonalInfo[month]?.recommended;
    
    return (
      <button
        key={month}
        className={cn(
          "relative px-2 py-1.5 border rounded text-center text-xs font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground touch-manipulation",
          selectedMonth === month && "bg-primary text-white border-primary shadow-sm",
          selectedMonth !== month && isCurrentMonth && "border-yellow-400",
          selectedMonth !== month && isRecommended && !isCurrentMonth && "border-green-400 bg-green-50/50",
          selectedMonth !== month && !isRecommended && !isCurrentMonth && "border-muted bg-background"
        )}
        onClick={() => onMonthChange(month)}
        aria-label={`Select ${month}`}
      >
        {isCurrentMonth && selectedMonth !== month && (
          <span className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-yellow-400" />
        )}
        {isRecommended && selectedMonth !== month && (
          <span className="absolute -top-1 -left-1 text-green-500">
            <CheckCircle2 className="h-2.5 w-2.5" />
          </span>
        )}
        {monthsShortArray[index]}
      </button>
    );
  };

  return (
    <div className="p-3 border-b border-muted">
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-medium text-base">When are you visiting?</h2>
        <HoverCard>
          <HoverCardTrigger asChild>
            <button className="text-muted-foreground hover:text-foreground" aria-label="Month selection information">
              <Info className="h-4 w-4" />
            </button>
          </HoverCardTrigger>
          <HoverCardContent className="w-72 p-3">
            <div className="space-y-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <span className="text-xs">Current month</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3 w-3 text-green-500" />
                <span className="text-xs">Recommended for most parks</span>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Different seasons offer unique park experiences. Select a month to see park conditions.
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      
      {isMobile ? (
        // Mobile view with season tabs
        <Tabs value={activeSeason} onValueChange={setActiveSeason}>
          <TabsList className="grid grid-cols-4 mb-2 h-8">
            <TabsTrigger value="winter" className="text-xs h-8 px-1">Winter</TabsTrigger>
            <TabsTrigger value="spring" className="text-xs h-8 px-1">Spring</TabsTrigger>
            <TabsTrigger value="summer" className="text-xs h-8 px-1">Summer</TabsTrigger>
            <TabsTrigger value="fall" className="text-xs h-8 px-1">Fall</TabsTrigger>
          </TabsList>
          
          {Object.entries(seasonGroups).map(([season, months]) => (
            <TabsContent key={season} value={season} className="m-0 mt-1">
              <div className="grid grid-cols-3 gap-2">
                {months.map((month, idx) => {
                  const monthIndex = monthsArray.findIndex(m => m === month);
                  return getMonthButton(month as Month, monthIndex);
                })}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      ) : (
        // Desktop view with all months
        <div className="grid grid-cols-6 gap-1.5">
          {monthsArray.map((month, index) => getMonthButton(month, index))}
        </div>
      )}
      
      <div className="mt-3 text-xs bg-muted/50 p-2.5 rounded-md flex items-start gap-2">
        <Calendar className="h-3.5 w-3.5 mt-0.5 flex-shrink-0 text-primary" />
        <p className="leading-tight text-muted-foreground">
          <span className="font-medium text-foreground">{selectedMonth}:</span> {' '}
          {seasonalInfo[selectedMonth]?.description || 
            "A great time to visit national parks with various seasonal conditions."}
        </p>
      </div>
    </div>
  );
}
