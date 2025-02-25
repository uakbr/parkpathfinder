import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { getAIRecommendation } from "@/lib/ai-service";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface AIRecommenderProps {
  selectedParkId: number | null;
  selectedMonth: string;
}

export function AIRecommender({ selectedParkId, selectedMonth }: AIRecommenderProps) {
  const [userPreferences, setUserPreferences] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string>("");
  const [isResponseVisible, setIsResponseVisible] = useState(false);
  const { toast } = useToast();
  
  // Common interests that users can quickly select
  const interests = [
    "Hiking", "Photography", "Wildlife", "Family-friendly", 
    "Wheelchair accessible", "Camping", "Swimming", "Scenic drives",
    "Bird watching", "Rock climbing", "Fishing", "Cultural sites"
  ];

  const addInterest = (interest: string) => {
    const currentPreferences = userPreferences.trim();
    
    if (currentPreferences === "") {
      setUserPreferences(interest);
    } else if (!currentPreferences.toLowerCase().includes(interest.toLowerCase())) {
      setUserPreferences(`${currentPreferences}, ${interest.toLowerCase()}`);
    }
  };

  const handleGenerateRecommendations = async () => {
    if (!selectedParkId) {
      toast({
        title: "No park selected",
        description: "Please select a park on the map first.",
        variant: "destructive",
      });
      return;
    }

    if (!userPreferences.trim()) {
      toast({
        title: "Preferences required",
        description: "Please tell us about your interests and preferences.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setIsResponseVisible(false);
    
    try {
      // Get the AI recommendation
      const recommendation = await getAIRecommendation(selectedParkId, selectedMonth, userPreferences);
      
      // Set the response and make it visible
      setAiResponse(recommendation);
      setIsResponseVisible(true);
      
      // Invalidate the cache for the specific park to refresh the recommendation
      queryClient.invalidateQueries({ queryKey: [`/api/parks/${selectedParkId}`] });
      
      toast({
        title: "Recommendation generated",
        description: "Your personalized recommendation is ready!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 flex-grow flex flex-col">
      <h2 className="font-montserrat font-semibold text-lg mb-3 flex items-center">
        <i className="bx bx-bulb text-secondary mr-2"></i> AI Travel Advisor
      </h2>
      
      <div className="bg-white rounded-lg border border-accent p-4 flex-grow flex flex-col">
        {!isResponseVisible ? (
          <>
            <p className="text-sm mb-3">
              Tell us about your interests and preferences for a personalized park recommendation:
            </p>
            
            <div className="mb-3 flex flex-wrap gap-2">
              {interests.map((interest) => (
                <Badge 
                  key={interest}
                  variant="outline" 
                  className="cursor-pointer hover:bg-accent transition-colors"
                  onClick={() => addInterest(interest)}
                >
                  + {interest}
                </Badge>
              ))}
            </div>
            
            <Textarea
              className="p-3 border border-gray-300 rounded-md resize-none h-24 mb-3 text-sm flex-grow focus:ring-2 focus:ring-accent focus:outline-none font-opensans"
              placeholder="Example: I enjoy photography, light hiking, and seeing wildlife. I'm traveling with my family including small children and prefer places with restroom facilities."
              value={userPreferences}
              onChange={(e) => setUserPreferences(e.target.value)}
            />
            
            <Button
              className="bg-primary hover:bg-secondary text-white transition-colors px-4 py-2 rounded font-montserrat font-medium text-sm flex items-center justify-center"
              onClick={handleGenerateRecommendations}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <i className="bx bx-loader-alt animate-spin mr-2"></i> Crafting your perfect itinerary...
                </>
              ) : (
                <>
                  <i className="bx bx-bulb mr-2"></i> Create My Park Plan
                </>
              )}
            </Button>
          </>
        ) : (
          <div className="flex flex-col h-full">
            <div className="bg-secondary bg-opacity-10 p-4 rounded-lg mb-3 flex-grow overflow-y-auto">
              <div className="flex items-start mb-3">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mr-2">
                  <i className="bx bx-bot"></i>
                </div>
                <div className="flex-grow">
                  <p className="text-xs text-gray-600 mb-1">AI Travel Advisor for {selectedMonth}</p>
                  <div className="text-sm font-opensans whitespace-pre-line">
                    {aiResponse}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center"
                onClick={() => setIsResponseVisible(false)}
              >
                <i className="bx bx-edit mr-2"></i> Edit Preferences
              </Button>
              <Button
                className="flex-1 bg-primary hover:bg-secondary text-white transition-colors flex items-center justify-center"
                onClick={handleGenerateRecommendations}
              >
                <i className="bx bx-refresh mr-2"></i> Regenerate
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
