import { useState } from "react";
import { Park } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { monthsArray } from "@/lib/types";
import { cn } from "@/lib/utils";

interface TripPlannerProps {
  selectedPark: Park | null;
  selectedMonth: string;
}

interface TripDay {
  id: number;
  trip_id: number;
  day_number: number;
  title: string;
  description: string | null;
  activities: TripActivity[];
}

interface TripActivity {
  id: number;
  trip_day_id: number;
  activity_id: number;
  name: string;
  description: string;
  latitude: string;
  longitude: string;
  category: string;
  order: number;
  start_time: string | null;
  end_time: string | null;
  notes: string | null;
  duration_minutes: number;
  difficulty: string | null;
}

export function TripPlanner({ selectedPark, selectedMonth }: TripPlannerProps) {
  const [days, setDays] = useState(3);
  const [preferences, setPreferences] = useState("");
  const [tripId, setTripId] = useState<number | null>(null);
  const { toast } = useToast();

  // Create a new trip plan
  const createTripMutation = useMutation({
    mutationFn: async () => {
      if (!selectedPark) throw new Error("No park selected");
      
      const res = await apiRequest("POST", "/api/trips", {
        parkId: selectedPark.id,
        month: selectedMonth,
        days,
        preferences,
        name: `${selectedPark.name} Trip - ${selectedMonth}`
      });
      
      return await res.json();
    },
    onSuccess: (data) => {
      setTripId(data.id);
      toast({
        title: "Trip plan created",
        description: "Now you can generate your itinerary!",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to create trip plan",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Generate an AI itinerary for the trip
  const generateItineraryMutation = useMutation({
    mutationFn: async () => {
      if (!tripId) throw new Error("No trip plan created yet");
      
      const res = await apiRequest("POST", `/api/trips/${tripId}/generate`, {});
      return await res.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Itinerary generated",
        description: `Your ${days}-day itinerary is ready!`,
      });
      
      // Invalidate the trip days query
      queryClient.invalidateQueries({ queryKey: ["/api/trips", tripId, "days"] });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to generate itinerary",
        description: error.message,
        variant: "destructive",
      });
    }
  });

  // Get trip days once generated
  const { 
    data: tripDays, 
    isLoading: isLoadingTripDays, 
    isFetching: isFetchingTripDays
  } = useQuery({
    queryKey: ["/api/trips", tripId, "days"],
    queryFn: async () => {
      if (!tripId) return null;
      const res = await fetch(`/api/trips/${tripId}/days`);
      if (!res.ok) throw new Error("Failed to fetch trip days");
      return res.json();
    },
    enabled: !!tripId,
  });

  // Helper function to format time (e.g., "09:00" to "9:00 AM")
  const formatTime = (time: string | null) => {
    if (!time) return "N/A";
    
    const [hourStr, minuteStr] = time.split(":");
    let hour = parseInt(hourStr);
    const minute = minuteStr;
    const ampm = hour >= 12 ? "PM" : "AM";
    
    hour = hour % 12;
    hour = hour ? hour : 12; // Convert 0 to 12
    
    return `${hour}:${minute} ${ampm}`;
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string | null) => {
    switch (difficulty?.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800";
      case "moderate": return "bg-yellow-100 text-yellow-800";
      case "difficult": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Initialize planning form
  const handleStartPlanning = () => {
    createTripMutation.mutate();
  };

  // Generate itinerary
  const handleGenerateItinerary = () => {
    generateItineraryMutation.mutate();
  };

  // Reset trip
  const handleReset = () => {
    setTripId(null);
    setPreferences("");
  };

  if (!selectedPark) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Trip Planner</CardTitle>
          <CardDescription>Select a park to start planning your trip</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="w-full mt-6 space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Trip Planner</CardTitle>
          <CardDescription>
            Plan your visit to {selectedPark.name} in {selectedMonth}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!tripId ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="days">Number of Days</Label>
                <div className="flex items-center space-x-2">
                  <Slider
                    id="days"
                    min={1}
                    max={7}
                    step={1}
                    value={[days]}
                    onValueChange={(value) => setDays(value[0])}
                    className="flex-1"
                  />
                  <span className="w-12 text-center font-medium">{days}</span>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="preferences">Preferences</Label>
                <Textarea
                  id="preferences"
                  placeholder="Tell us about your interests, fitness level, and what you'd like to experience (e.g., hiking, photography, wildlife, family-friendly activities)"
                  value={preferences}
                  onChange={(e) => setPreferences(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>
              
              <div className="pt-4">
                <Button 
                  onClick={handleStartPlanning}
                  disabled={createTripMutation.isPending}
                  className="w-full"
                >
                  {createTripMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Plan...
                    </>
                  ) : (
                    "Start Planning"
                  )}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {!tripDays?.length && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {selectedPark.name} - {days} Day Trip
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedMonth} | {preferences ? preferences : "General visit"}
                      </p>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleReset}
                    >
                      Reset
                    </Button>
                  </div>
                  
                  <div className="pt-2">
                    <Button 
                      onClick={handleGenerateItinerary}
                      disabled={generateItineraryMutation.isPending}
                      className="w-full"
                    >
                      {generateItineraryMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating AI Itinerary...
                        </>
                      ) : (
                        "Generate AI Itinerary"
                      )}
                    </Button>
                  </div>
                </div>
              )}
              
              {(isLoadingTripDays || isFetchingTripDays) && (
                <div className="flex justify-center items-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              )}
              
              {tripDays && tripDays.length > 0 && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Your Itinerary</h3>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleReset}
                    >
                      Plan Another Trip
                    </Button>
                  </div>
                  
                  <div className="space-y-4">
                    {tripDays.map((day: TripDay) => (
                      <Card key={day.id} className="overflow-hidden">
                        <CardHeader className="bg-primary/5 pb-3">
                          <CardTitle className="text-md">
                            {day.title}
                          </CardTitle>
                          <CardDescription>
                            {day.description}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0">
                          <div className="divide-y">
                            {day.activities.map((activity: TripActivity) => (
                              <div key={activity.id} className="p-4 hover:bg-muted/50">
                                <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-medium">{activity.name}</h4>
                                  <span className={cn("px-2 py-1 rounded-full text-xs font-medium", 
                                    getDifficultyColor(activity.difficulty))}>
                                    {activity.difficulty || "Moderate"}
                                  </span>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {activity.description.length > 100 
                                    ? `${activity.description.substring(0, 100)}...` 
                                    : activity.description}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                  <div className="flex items-center">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatTime(activity.start_time)} - {formatTime(activity.end_time)}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="h-3 w-3 mr-1" />
                                    {activity.category}
                                  </div>
                                  <div>
                                    {Math.floor(activity.duration_minutes / 60)} hr {activity.duration_minutes % 60 > 0 ? `${activity.duration_minutes % 60} min` : ''}
                                  </div>
                                </div>
                                {activity.notes && (
                                  <div className="mt-2 text-xs bg-blue-50 text-blue-700 p-2 rounded">
                                    <strong>Tip:</strong> {activity.notes}
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}