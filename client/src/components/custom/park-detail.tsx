import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Park } from "@/lib/types";
import { activityIcons, getActivityIcon } from "@/lib/utils";
import { getAIRecommendation } from "@/lib/ai-service";

interface ParkDetailProps {
  park: Park;
  selectedMonth: string;
  onClose: () => void;
}

export function ParkDetail({ park, selectedMonth, onClose }: ParkDetailProps) {
  const [aiRecommendation, setAiRecommendation] = useState<string>("");
  const [isLoadingRecommendation, setIsLoadingRecommendation] = useState<boolean>(false);
  
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
    <div className="p-0">
      <img
        src={park.image_url}
        alt={park.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="font-montserrat font-bold text-xl text-primary">{park.name}</h3>
          <button className="text-secondary hover:text-primary transition-colors">
            <i className="bx bx-bookmark text-2xl"></i>
          </button>
        </div>
        
        <div className="flex items-center mt-1 mb-3">
          <i className="bx bxs-map text-secondary mr-1"></i>
          <span className="text-sm text-gray-600">{park.state}</span>
          <span className="mx-2 text-gray-400">|</span>
          <div className="flex items-center">
            <i className="bx bxs-star text-yellow-500 mr-1"></i>
            <span className="text-sm font-semibold">{park.rating}</span>
            <span className="text-xs text-gray-500 ml-1">({park.review_count.toLocaleString()} reviews)</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-montserrat font-semibold text-sm mb-2">{selectedMonth} Highlights</h4>
          <div className="flex flex-wrap gap-2">
            {park.highlights.map((highlight, index) => (
              <Badge key={index} variant="green" className="rounded-full">
                {highlight}
              </Badge>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-montserrat font-semibold text-sm mb-2">Weather in {selectedMonth}</h4>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center">
              <i className="bx bx-sun text-yellow-500 mr-1"></i>
              <span>Avg High: {weather.high}</span>
            </div>
            <div className="flex items-center">
              <i className="bx bx-moon text-blue-500 mr-1"></i>
              <span>Avg Low: {weather.low}</span>
            </div>
            <div className="flex items-center">
              <i className="bx bx-cloud-rain text-blue-400 mr-1"></i>
              <span>Precip: {weather.precipitation}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-montserrat font-semibold text-sm mb-2">Popular Activities</h4>
          <div className="grid grid-cols-3 gap-2">
            {park.activities.slice(0, 6).map((activity) => (
              <div key={activity} className="flex flex-col items-center bg-lightAccent p-2 rounded">
                <i className={`bx ${getActivityIcon(activity)} text-2xl text-secondary`}></i>
                <span className="text-xs mt-1">{activity}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="font-montserrat font-semibold text-sm mb-2">AI Recommendations</h4>
          <div className="bg-lightAccent p-3 rounded text-sm min-h-[80px]">
            {isLoadingRecommendation ? (
              <div className="flex items-center justify-center h-full">
                <div className="flex items-center gap-2">
                  <i className="bx bx-loader-alt animate-spin text-secondary"></i>
                  <span>Generating personalized recommendations...</span>
                </div>
              </div>
            ) : (
              <p className="font-opensans">{aiRecommendation}</p>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="default"
            className="flex items-center"
            onClick={onClose}
          >
            <i className="bx bx-info-circle mr-2"></i> More Details
          </Button>
          <Button
            variant="secondary" 
            className="flex items-center"
          >
            <i className="bx bx-calendar-plus mr-2"></i> Plan Visit
          </Button>
        </div>
      </div>
    </div>
  );
}
