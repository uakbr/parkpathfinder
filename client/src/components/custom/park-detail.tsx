import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Park } from "@/lib/types";
import { activityIcons, getActivityIcon } from "@/lib/utils";
import { getAIRecommendation } from "@/lib/ai-service";
import { X, MapPin, Star, SunMedium, Moon, CloudRain, CalendarPlus, Info, Loader2 } from "lucide-react";

interface ParkDetailProps {
  park: Park;
  selectedMonth: string;
  onClose: () => void;
}

export function ParkDetail({ park, selectedMonth, onClose }: ParkDetailProps) {
  const [aiRecommendation, setAiRecommendation] = useState<string>("");
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState<boolean>(false);
  const [showFullDescription, setShowFullDescription] = useState<boolean>(false);
  
  const monthLower = selectedMonth.toLowerCase();
  const weather = park.weather[monthLower] || {
    high: "N/A",
    low: "N/A",
    precipitation: "N/A"
  };
  
  // Load AI recommendation when park or month changes
  useEffect(() => {
    const loadRecommendation = async () => {
      setIsLoadingRecommendation(true);
      try {
        const recommendation = await getAIRecommendation(
          park.id,
          selectedMonth,
          "I enjoy hiking, photography, and experiencing nature. I prefer less crowded trails and beautiful scenery."
        );
        setAiRecommendation(recommendation);
      } catch (error) {
        console.error("Failed to load recommendation:", error);
        setAiRecommendation("Recommendation unavailable at this time. Please try again later.");
      } finally {
        setIsLoadingRecommendation(false);
      }
    };
    
    loadRecommendation();
  }, [park.id, selectedMonth]);
  
  return (
    <div className="p-0 overflow-hidden">
      <div className="relative">
        <img
          src={park.image_url}
          alt={park.name}
          className="w-full h-36 md:h-48 object-cover"
        />
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={onClose}
          className="absolute top-2 right-2 bg-white/80 hover:bg-white rounded-full shadow-md w-8 h-8 p-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="p-3 md:p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-lg md:text-xl text-foreground">{park.name}</h3>
        </div>
        
        <div className="flex items-center mt-1 mb-3 text-muted-foreground">
          <div className="flex items-center">
            <MapPin className="h-3 w-3 mr-1" />
            <span className="text-xs">{park.state}</span>
          </div>
          <span className="mx-2 text-gray-300">|</span>
          <div className="flex items-center">
            <Star className="h-3 w-3 fill-yellow-500 text-yellow-500 mr-1" />
            <span className="text-xs font-medium">{park.rating}</span>
            <span className="text-xs ml-1">({park.review_count.toLocaleString()})</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Left column */}
          <div>
            <h4 className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">Highlights</h4>
            <div className="flex flex-wrap gap-1">
              {park.highlights.slice(0, 4).map((highlight, index) => (
                <Badge key={index} variant="outline" className="text-[10px] h-5 rounded-full font-normal">
                  {highlight}
                </Badge>
              ))}
              {park.highlights.length > 4 && (
                <Badge variant="outline" className="text-[10px] h-5 rounded-full font-normal">
                  +{park.highlights.length - 4} more
                </Badge>
              )}
            </div>
          </div>
          
          {/* Right column - Weather */}
          <div>
            <h4 className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">{selectedMonth} Weather</h4>
            <div className="grid grid-cols-3 gap-1 text-xs">
              <div className="flex flex-col items-center">
                <SunMedium className="h-3 w-3 text-yellow-500 mb-1" />
                <span>{weather.high}</span>
              </div>
              <div className="flex flex-col items-center">
                <Moon className="h-3 w-3 text-blue-500 mb-1" />
                <span>{weather.low}</span>
              </div>
              <div className="flex flex-col items-center">
                <CloudRain className="h-3 w-3 text-blue-400 mb-1" />
                <span>{weather.precipitation}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Activities */}
        <div className="mb-4">
          <h4 className="font-medium text-xs uppercase tracking-wide text-muted-foreground mb-2">Activities</h4>
          <div className="grid grid-cols-4 gap-1.5">
            {park.activities.slice(0, 8).map((activity) => (
              <div key={activity} className="flex flex-col items-center p-1.5 rounded bg-muted">
                <i className={`bx ${getActivityIcon(activity)} text-lg text-muted-foreground`}></i>
                <span className="text-[9px] mt-1 text-center leading-tight">{activity.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
        
        {/* AI Insights - collapsible for mobile */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-medium text-xs uppercase tracking-wide text-muted-foreground">AI Recommendation</h4>
          </div>
          <div className="bg-background rounded-lg text-xs p-2.5 border border-border shadow-sm min-h-12 max-h-32 overflow-y-auto no-scrollbar">
            {isLoadingRecommendation ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2 text-primary" />
                <span className="text-muted-foreground text-xs">Creating personalized insights...</span>
              </div>
            ) : (
              <div className="leading-relaxed whitespace-pre-line text-muted-foreground">
                {aiRecommendation ? (
                  <>
                    {showFullDescription 
                      ? aiRecommendation 
                      : `${aiRecommendation.substring(0, 150)}${aiRecommendation.length > 150 ? '...' : ''}`
                    }
                    {aiRecommendation.length > 150 && (
                      <button 
                        onClick={() => setShowFullDescription(!showFullDescription)}
                        className="text-primary hover:text-primary/80 font-medium ml-1"
                      >
                        {showFullDescription ? 'Show less' : 'Read more'}
                      </button>
                    )}
                  </>
                ) : (
                  "Select a park to get personalized recommendations."
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Action buttons */}
        <div className="flex justify-between gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center justify-center flex-1"
            onClick={onClose}
          >
            <Info className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Details</span>
          </Button>
          <Button
            variant="default" 
            size="sm"
            className="flex items-center justify-center flex-1"
          >
            <CalendarPlus className="h-3.5 w-3.5 mr-1.5" />
            <span className="text-xs">Plan Trip</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
