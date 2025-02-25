import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/custom/header";
import { MonthSelector } from "@/components/custom/month-selector";
import { ParkCard } from "@/components/custom/park-card";
import { ParkMap } from "@/components/custom/park-map";
import { AIRecommender } from "@/components/custom/ai-recommender";
import { MobileNav } from "@/components/custom/mobile-nav";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Park, monthsArray } from "@/lib/types";
import { getCurrentMonth } from "@/lib/utils";
import { parkData } from "@/lib/park-data"; // Fallback for development

export default function Home() {
  // State for the app
  const [selectedMonth, setSelectedMonth] = useState<string>(getCurrentMonth());
  const [selectedParkId, setSelectedParkId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("map");
  
  // Fetch parks data
  const { data: parks = [], isLoading, error } = useQuery({ 
    queryKey: ["/api/parks"],
    staleTime: 60000, // 1 minute
  });
  
  // Filter parks based on selected month
  const filteredParks = (parks.length > 0 ? parks : parkData).filter((park: Park) => {
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
        park.activities.some(activity => activity.toLowerCase().includes(query))
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
  };
  
  // Render different content based on mobile tab
  const renderMobileContent = () => {
    switch (activeTab) {
      case "map":
        return (
          <ParkMap
            parks={sortedParks}
            selectedParkId={selectedParkId}
            selectedMonth={selectedMonth}
            onSelectPark={handleSelectPark}
          />
        );
      case "parks":
        return (
          <div className="p-4 overflow-y-auto h-[calc(100vh-10rem)]">
            <h2 className="font-montserrat font-semibold text-lg mb-3">All Parks</h2>
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
        );
      case "months":
        return (
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
        );
      case "ai":
        return (
          <AIRecommender
            selectedParkId={selectedParkId}
            selectedMonth={selectedMonth}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="flex flex-col h-screen">
      <Header />
      
      {/* Main Content Container */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Control Panel - Hidden on Mobile when not active */}
        <aside className={`md:w-80 lg:w-96 bg-background border-r border-accent md:h-auto flex flex-col z-10 ${activeTab !== "parks" && activeTab !== "months" && activeTab !== "ai" ? "hidden" : ""} md:flex`}>
          {/* Search Input */}
          <div className="p-4 border-b border-accent">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search for a park..."
                value={searchQuery}
                onChange={handleSearch}
                className="w-full px-4 py-2 pr-10 border border-secondary rounded-md font-opensans"
              />
              <i className="bx bx-search absolute right-3 top-3 text-secondary"></i>
            </div>
          </div>
          
          {/* Month Selector */}
          <MonthSelector
            selectedMonth={selectedMonth}
            onMonthChange={handleMonthChange}
          />
          
          {/* Top Recommendations */}
          <div className="p-4 border-b border-accent">
            <h2 className="font-montserrat font-semibold text-lg mb-3">Top Parks for {selectedMonth}</h2>
            <div className="space-y-3 custom-scrollbar overflow-y-auto max-h-64">
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
          
          {/* AI Recommender */}
          <AIRecommender 
            selectedParkId={selectedParkId}
            selectedMonth={selectedMonth}
          />
        </aside>
        
        {/* Map and Details Container */}
        <div className="flex-1 flex flex-col">
          {/* Mobile view shows different content based on activeTab */}
          <div className="md:hidden flex-1">
            {renderMobileContent()}
          </div>
          
          {/* Desktop view always shows the map */}
          <div className="hidden md:flex flex-1">
            <ParkMap
              parks={sortedParks}
              selectedParkId={selectedParkId}
              selectedMonth={selectedMonth}
              onSelectPark={handleSelectPark}
            />
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      <MobileNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
