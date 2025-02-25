import { useState, useEffect, useRef } from "react";
import { ParkDetail } from "./park-detail";
import { ParkMarker } from "./park-marker";
import { Park } from "@/lib/types";
import { getMapCenter, getMapZoom } from "@/lib/utils";

interface ParkMapProps {
  parks: Park[];
  selectedParkId: number | null;
  selectedMonth: string;
  onSelectPark: (parkId: number) => void;
}

export function ParkMap({ parks, selectedParkId, selectedMonth, onSelectPark }: ParkMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  
  // Map simulation - in a real app, this would use React Map GL or Google Maps
  const markers = parks.map(park => ({
    id: park.id,
    name: park.name,
    latitude: parseFloat(park.latitude),
    longitude: parseFloat(park.longitude),
    state: park.state,
    rating: park.rating,
    isSelected: park.id === selectedParkId
  }));
  
  const selectedPark = parks.find(park => park.id === selectedParkId);
  
  // Calculate positions for markers - this is a simulation, real app would use geo coordinates
  // This positions markers in a grid pattern for demonstration purposes
  const calculatePositions = () => {
    const positions: { [key: number]: { top: string; left: string } } = {};
    
    // Create a grid of positions
    const rows = 3;
    const cols = 5;
    
    parks.forEach((park, index) => {
      const row = Math.floor(index / cols);
      const col = index % cols;
      
      const top = 20 + (row * 20) + (Math.random() * 10); // Add some randomness
      const left = 15 + (col * 15) + (Math.random() * 10); // Add some randomness
      
      positions[park.id] = {
        top: `${top}%`,
        left: `${left}%`
      };
    });
    
    return positions;
  };
  
  const markerPositions = calculatePositions();
  
  return (
    <div className="flex-1 relative overflow-hidden">
      {/* Map Background */}
      <div className="absolute inset-0 map-container bg-cover bg-center bg-gray-200">
        <div className="absolute inset-0 map-overlay flex items-center justify-center bg-opacity-10 bg-background">
          {/* Park Markers */}
          {markers.map((marker) => (
            <ParkMarker
              key={marker.id}
              marker={marker}
              position={markerPositions[marker.id]}
              onClick={() => onSelectPark(marker.id)}
            />
          ))}
        </div>
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-md shadow-md p-2 flex flex-col space-y-2 z-10">
        <button className="w-8 h-8 bg-accent hover:bg-secondary text-white rounded-md flex items-center justify-center transition-colors">
          <i className="bx bx-plus"></i>
        </button>
        <button className="w-8 h-8 bg-accent hover:bg-secondary text-white rounded-md flex items-center justify-center transition-colors">
          <i className="bx bx-minus"></i>
        </button>
        <button className="w-8 h-8 bg-accent hover:bg-secondary text-white rounded-md flex items-center justify-center transition-colors">
          <i className="bx bx-current-location"></i>
        </button>
      </div>

      {/* Selected Park Detail Card */}
      {selectedPark && (
        <div className="absolute bottom-4 left-4 right-4 md:w-2/3 lg:w-1/2 xl:w-1/3 md:left-4 md:right-auto bg-white rounded-lg shadow-lg border border-accent overflow-hidden z-10">
          <ParkDetail 
            park={selectedPark} 
            selectedMonth={selectedMonth}
            onClose={() => onSelectPark(selectedPark.id)}
          />
        </div>
      )}
    </div>
  );
}
