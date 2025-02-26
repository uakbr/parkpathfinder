import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/custom/header";
import { MonthSelector } from "@/components/custom/month-selector";
import { ParkCard } from "@/components/custom/park-card";
import { ParkMap } from "@/components/custom/park-map";
import { AIRecommender } from "@/components/custom/ai-recommender";
import { TripPlanner } from "@/components/custom/trip-planner";
import { TripMap } from "@/components/custom/trip-map";
import { MobileNav } from "@/components/custom/mobile-nav";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Park, monthsArray, monthsShortArray } from "@/lib/types";
import { getCurrentMonth, cn } from "@/lib/utils";
import { parkData } from "@/lib/park-data"; // Fallback for development
import { Search, Calendar, Map, PlaneTakeoff } from "lucide-react";

export default function Home() {
  // State for the app
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [selectedParkId, setSelectedParkId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("explore");
  const [currentView, setCurrentView] = useState<string>("map");
  const [tripId, setTripId] = useState<number | null>(null);
  const [selectedPark, setSelectedPark] = useState<Park | null>(null);
  
  // Ensure current month is always set on initial load
  useEffect(() => {
    const currentMonth = getCurrentMonth();
    setSelectedMonth(currentMonth);
  }, []);
  
  // Fetch parks data
  const { data: parks = [], isLoading, error } = useQuery({ 
    queryKey: ["/api/parks"],
    staleTime: 60000, // 1 minute
  });
  
  // Set the data source with fallback to local data
  const parksData: Park[] = (parks as Park[]).length > 0 ? (parks as Park[]) : parkData;
  
  // Filter parks based on selected month
  const filteredParks = parksData.filter((park: Park) => {
    // First, filter by month if available
    if (park.best_months && !park.best_months.includes(selectedMonth)) {
      return false;
    }
    
    // Then, filter by search query if it exists
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        park.name.toLowerCase().includes(query) ||
        park.state.toLowerCase().includes(query) ||
        (park.activities && park.activities.some(activity => 
          activity.toLowerCase().includes(query)
        ))
      );
    }
    
    return true;
  });
  
  // Sort parks by rating
  const sortedParks = [...filteredParks].sort((a, b) => 
    parseFloat(b.rating) - parseFloat(a.rating)
  );
  
  // Get top 5 parks
  const topParks = sortedParks.slice(0, 5);

  // Update selectedPark when selectedParkId changes
  useEffect(() => {
    if (selectedParkId) {
      const park = parksData.find((p) => p.id === selectedParkId);
      if (park) {
        setSelectedPark(park);
      }
    } else {
      setSelectedPark(null);
    }
  }, [selectedParkId, parksData]);
  
  // Handle park selection
  const handleSelectPark = (parkId: number) => {
    setSelectedParkId(parkId === selectedParkId ? null : parkId);
  };
  
  // Handle month change
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
  };
  
  // Handle search
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Handle mobile tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    
    // Reset view when changing tabs
    if (tab === "explore") {
      setCurrentView("map");
    } else if (tab === "plan") {
      setCurrentView("create");
    }
  };
  
  // Find currently selected park
  const getSelectedParkDetails = () => {
    if (!selectedParkId) return null;
    return parksData.find(park => park.id === selectedParkId) || null;
  };

  const renderExploreContent = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Tabs for mobile view */}
        <div className="md:hidden">
          <Tabs defaultValue="map" value={currentView} onValueChange={setCurrentView} className="w-full">
            <div className="border-b px-2">
              <TabsList className="h-12 w-full bg-transparent gap-4 p-0">
                <TabsTrigger 
                  value="map" 
                  className="h-12 flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none"
                >
                  <Map className="h-4 w-4 mr-2" />
                  Map
                </TabsTrigger>
                <TabsTrigger 
                  value="parks" 
                  className="h-12 flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Parks
                </TabsTrigger>
                <TabsTrigger 
                  value="months" 
                  className="h-12 flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Month
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="map" className="m-0 h-[calc(100vh-10rem)]">
              <div className="relative h-full">
                <ParkMap
                  parks={sortedParks}
                  selectedParkId={selectedParkId}
                  selectedMonth={selectedMonth}
                  onSelectPark={handleSelectPark}
                />
                {/* Quick month selector floating on mobile map */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm rounded-full shadow-lg border border-border overflow-x-auto max-w-[90%] no-scrollbar">
                  <div className="flex overflow-x-auto items-center py-1 px-3 gap-1.5 no-scrollbar">
                    {monthsArray.map((month, i) => {
                      const shortName = month.substring(0, 3);
                      const isCurrent = month === getCurrentMonth();
                      
                      return (
                        <button
                          key={month}
                          className={cn(
                            "text-xs py-1 px-2 rounded-full min-w-8 relative transition-colors",
                            selectedMonth === month 
                              ? "bg-primary text-primary-foreground font-medium" 
                              : "bg-background hover:bg-muted",
                            isCurrent && selectedMonth !== month && "ring-1 ring-primary/30"
                          )}
                          onClick={() => handleMonthChange(month)}
                        >
                          {isCurrent && selectedMonth !== month && (
                            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 bg-primary rounded-full" />
                          )}
                          {shortName}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="parks" className="m-0 h-[calc(100vh-10rem)] overflow-y-auto">
              <div className="p-4">
                <div className="mb-4">
                  <div className="relative">
                    <Input
                      type="text"
                      placeholder="Search for a park..."
                      value={searchQuery}
                      onChange={handleSearch}
                      className="w-full pl-10"
                    />
                    <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  </div>
                </div>
                
                <h2 className="font-medium text-lg mb-3">Parks for {selectedMonth}</h2>
                <div className="space-y-3">
                  {sortedParks.map((park) => (
                    <ParkCard
                      key={park.id}
                      park={park}
                      isSelected={park.id === selectedParkId}
                      onClick={() => handleSelectPark(park.id)}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="months" className="m-0 p-4 h-[calc(100vh-10rem)] overflow-y-auto">
              <MonthSelector
                selectedMonth={selectedMonth}
                onMonthChange={handleMonthChange}
              />
              
              {/* Top 5 parks for selected month */}
              <div className="mt-6">
                <h2 className="font-medium text-lg mb-3">Top Parks for {selectedMonth}</h2>
                <div className="space-y-3">
                  {topParks.map((park) => (
                    <ParkCard
                      key={park.id}
                      park={park}
                      isSelected={park.id === selectedParkId}
                      onClick={() => handleSelectPark(park.id)}
                    />
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Desktop layout */}
        <div className="hidden md:flex flex-1 overflow-hidden">
          <aside className="w-80 lg:w-96 bg-background border-r border-muted h-full overflow-y-auto">
            <div className="p-4 border-b border-muted">
              <div className="relative">
                <Input
                  type="text"
                  placeholder="Search for a park..."
                  value={searchQuery}
                  onChange={handleSearch}
                  className="w-full pl-10"
                />
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
            
            <MonthSelector
              selectedMonth={selectedMonth}
              onMonthChange={handleMonthChange}
            />
            
            <div className="p-4 border-b border-muted">
              <h2 className="font-medium text-lg mb-3">Top Parks for {selectedMonth}</h2>
              <div className="space-y-3 overflow-y-auto max-h-64">
                {topParks.map((park) => (
                  <ParkCard
                    key={park.id}
                    park={park}
                    isSelected={park.id === selectedParkId}
                    onClick={() => handleSelectPark(park.id)}
                  />
                ))}
              </div>
            </div>
            
            <AIRecommender 
              selectedParkId={selectedParkId}
              selectedMonth={selectedMonth}
            />
          </aside>
          
          <div className="flex-1">
            <ParkMap
              parks={sortedParks}
              selectedParkId={selectedParkId}
              selectedMonth={selectedMonth}
              onSelectPark={handleSelectPark}
            />
          </div>
        </div>
      </div>
    );
  };
  
  const renderPlanContent = () => {
    return (
      <div className="flex flex-col h-full">
        {/* Tabs for mobile view */}
        <div className="md:hidden">
          <Tabs defaultValue="create" value={currentView} onValueChange={setCurrentView} className="w-full">
            <div className="border-b px-2">
              <TabsList className="h-12 w-full bg-transparent gap-4 p-0">
                <TabsTrigger 
                  value="create" 
                  className="h-12 flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none"
                >
                  Create Plan
                </TabsTrigger>
                <TabsTrigger 
                  value="map" 
                  className="h-12 flex-1 data-[state=active]:bg-transparent data-[state=active]:border-b-2 rounded-none"
                >
                  View Map
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="create" className="m-0 overflow-y-auto px-4 pt-4 pb-16">
              <TripPlanner 
                selectedPark={selectedPark} 
                selectedMonth={selectedMonth} 
              />
            </TabsContent>
            
            <TabsContent value="map" className="m-0 overflow-y-auto px-4 pt-4 pb-16">
              <TripMap 
                tripId={tripId} 
                parkId={selectedParkId} 
              />
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Desktop layout */}
        <div className="hidden md:flex flex-1 p-6 gap-6 overflow-y-auto">
          <div className="flex-1">
            <TripPlanner 
              selectedPark={selectedPark} 
              selectedMonth={selectedMonth} 
            />
          </div>
          <div className="flex-1">
            <TripMap 
              tripId={tripId} 
              parkId={selectedParkId} 
            />
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      <main className="flex-1 overflow-hidden">
        <Tabs defaultValue="explore" value={activeTab} onValueChange={handleTabChange} className="h-full">
          {/* Main Tabs */}
          <div className="hidden md:block border-b px-4">
            <TabsList className="h-14 bg-transparent gap-4">
              <TabsTrigger value="explore" className="text-base px-4">
                <Map className="h-4 w-4 mr-2" />
                Explore Parks
              </TabsTrigger>
              <TabsTrigger value="plan" className="text-base px-4">
                <PlaneTakeoff className="h-4 w-4 mr-2" />
                Plan Your Trip
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="explore" className="m-0 h-full">
            {renderExploreContent()}
          </TabsContent>
          
          <TabsContent value="plan" className="m-0 h-full">
            {renderPlanContent()}
          </TabsContent>
        </Tabs>
      </main>
      
      {/* Mobile Navigation */}
      <div className="md:hidden">
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t z-50">
          <div className="flex items-center justify-around h-16">
            <Button
              variant="ghost"
              className={`flex-1 h-full rounded-none flex flex-col items-center justify-center ${activeTab === 'explore' ? 'text-primary' : ''}`}
              onClick={() => handleTabChange('explore')}
            >
              <Map className="h-5 w-5 mb-1" />
              <span className="text-xs">Explore</span>
            </Button>
            <Button
              variant="ghost"
              className={`flex-1 h-full rounded-none flex flex-col items-center justify-center ${activeTab === 'plan' ? 'text-primary' : ''}`}
              onClick={() => handleTabChange('plan')}
            >
              <PlaneTakeoff className="h-5 w-5 mb-1" />
              <span className="text-xs">Plan Trip</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
