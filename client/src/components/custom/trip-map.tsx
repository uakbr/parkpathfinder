import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { safeCoordinates } from "@/lib/utils";

interface TripMapProps {
  tripId: number | null;
  parkId: number | null;
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

// Define custom marker icons
const createMarkerIcon = (color: string, num: number) => {
  return L.divIcon({
    className: "custom-div-icon",
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-weight: bold; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">${num}</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -10],
  });
};

// Helper function to ensure we have valid coordinates for Leaflet
function ensureValidCoordinates(coords: [number, number] | null): L.LatLngTuple {
  // Default coordinates in case of null (center of US)
  return coords || [39.8283, -98.5795] as L.LatLngTuple;
}

// Define route colors for each day
const ROUTE_COLORS = [
  "#2563eb", // Blue
  "#16a34a", // Green
  "#d97706", // Amber
  "#dc2626", // Red
  "#9333ea", // Purple
  "#0891b2", // Cyan
  "#be123c", // Rose
];

export function TripMap({ tripId, parkId }: TripMapProps) {
  const [activeDay, setActiveDay] = useState<string>("all");
  
  // Get trip days and activities
  const { 
    data: tripDays, 
    isLoading: isLoadingTripDays 
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

  if (!tripId || !parkId) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Trip Map</CardTitle>
          <CardDescription>Create a trip plan to see your itinerary on the map</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (isLoadingTripDays) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Trip Map</CardTitle>
          <CardDescription>Loading your itinerary...</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (!tripDays || tripDays.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Trip Map</CardTitle>
          <CardDescription>Generate an itinerary to see your trip on the map</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Get all activities
  const allActivities: TripActivity[] = tripDays.flatMap((day: TripDay) => day.activities);
  
  // If no activities, return empty card
  if (allActivities.length === 0) {
    return (
      <Card className="w-full mt-6">
        <CardHeader>
          <CardTitle>Trip Map</CardTitle>
          <CardDescription>No activities found in your itinerary</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  // Get center coordinates based on first activity
  const firstActivity = allActivities[0];
  // Default coordinates if no activity is found (center of US)
  let centerCoords: [number, number] = [39.8283, -98.5795];
  
  if (firstActivity) {
    const coords = safeCoordinates(
      parseFloat(firstActivity.latitude),
      parseFloat(firstActivity.longitude)
    );
    if (coords !== null) {
      centerCoords = coords;
    }
  }

  const dayTabs = ["all", ...tripDays.map((day: TripDay) => day.day_number.toString())];

  return (
    <Card className="w-full mt-6">
      <CardHeader>
        <CardTitle>Trip Map</CardTitle>
        <CardDescription>Visualize your itinerary on the map</CardDescription>
        <Tabs
          defaultValue="all"
          value={activeDay}
          onValueChange={setActiveDay}
          className="mt-4"
        >
          <TabsList className="grid grid-cols-8">
            {dayTabs.map(day => (
              <TabsTrigger key={day} value={day}>
                {day === "all" ? "All Days" : `Day ${day}`}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden">
        <div className="h-[400px]">
          <MapContainer
            center={centerCoords}
            zoom={13}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {tripDays.map((day: TripDay, dayIndex: number) => {
              // Skip if filtering by day and this isn't the active day
              if (activeDay !== "all" && day.day_number.toString() !== activeDay) {
                return null;
              }

              // Create route for this day's activities
              const dayActivities = day.activities.sort((a, b) => a.order - b.order);
              
              // Create polyline for route between activities
              const routePoints: [number, number][] = dayActivities.map(activity => {
                const coords = safeCoordinates(
                  parseFloat(activity.latitude),
                  parseFloat(activity.longitude)
                );
                // Default to a valid coordinate if parsing fails
                return coords !== null ? coords : [39.8283, -98.5795];
              });
              
              const dayColor = ROUTE_COLORS[dayIndex % ROUTE_COLORS.length];
              
              return (
                <div key={day.id}>
                  {/* Draw route between activities */}
                  {routePoints.length > 1 && (
                    <Polyline 
                      positions={routePoints}
                      color={dayColor}
                      weight={4}
                      opacity={0.7}
                      dashArray="10, 10"
                    />
                  )}
                  
                  {/* Place markers for each activity */}
                  {dayActivities.map((activity, actIndex) => {
                    const coords = safeCoordinates(
                      parseFloat(activity.latitude),
                      parseFloat(activity.longitude)
                    );
                    // Use helper function to ensure valid coordinates
                    const position = ensureValidCoordinates(coords);
                    
                    return (
                      <Marker
                        key={activity.id}
                        position={position as [number, number]}
                        icon={createMarkerIcon(dayColor, actIndex + 1)}
                      >
                        <Popup>
                          <div className="min-w-[200px]">
                            <h3 className="font-medium">{activity.name}</h3>
                            <p className="text-xs text-gray-600 mt-1">Day {day.day_number}, Stop {actIndex + 1}</p>
                            <p className="text-xs mt-2">{activity.description.substring(0, 100)}...</p>
                            <div className="text-xs mt-2">
                              {activity.start_time && (
                                <p className="font-medium">Time: {activity.start_time} - {activity.end_time}</p>
                              )}
                              <p>Duration: {Math.floor(activity.duration_minutes / 60)} hr {activity.duration_minutes % 60} min</p>
                            </div>
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
                </div>
              );
            })}
          </MapContainer>
        </div>
      </CardContent>
    </Card>
  );
}