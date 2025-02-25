import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { ParkDetail } from "./park-detail";
import { Park } from "@/lib/types";

// Fix for Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom park icons
const parkIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/5266/5266848.png',
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

const selectedParkIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/5266/5266880.png',
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

// Default center coordinates for USA
const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795];
const DEFAULT_ZOOM = 4;

// Helper to parse coordinates safely
function parseCoords(lat: string | number | undefined, lng: string | number | undefined): [number, number] | null {
  if (lat === undefined || lng === undefined) return null;
  
  try {
    // Parse string values to numbers
    const numLat = typeof lat === 'string' ? parseFloat(lat) : Number(lat);
    const numLng = typeof lng === 'string' ? parseFloat(lng) : Number(lng);
    
    // Validate the parsed numbers
    if (isNaN(numLat) || isNaN(numLng)) {
      console.warn('Invalid coordinates (NaN):', { lat, lng });
      return null;
    }
    
    // Check for valid coordinate ranges
    if (numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) {
      console.warn('Coordinates out of range:', { lat: numLat, lng: numLng });
      return null;
    }
    
    return [numLat, numLng];
  } catch (error) {
    console.error('Error parsing coordinates:', error);
    return null;
  }
}

// Component to fly to a marker on the map
function FlyToMarker({ position }: { position: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    try {
      // Add a slight delay to ensure map is ready
      const timer = setTimeout(() => {
        map.flyTo(position, 8, {
          animate: true,
          duration: 1.5
        });
      }, 100);
      
      return () => clearTimeout(timer);
    } catch (error) {
      console.error('Error flying to marker:', error);
    }
  }, [map, position]);
  
  return null;
}

interface ParkMapProps {
  parks: Park[];
  selectedParkId: number | null;
  selectedMonth: string;
  onSelectPark: (parkId: number) => void;
}

export function ParkMap({ parks, selectedParkId, selectedMonth, onSelectPark }: ParkMapProps) {
  // Find the selected park
  const selectedPark = useMemo(() => {
    return parks.find(park => park.id === selectedParkId);
  }, [parks, selectedParkId]);
  
  // Get valid markers with coordinates
  const validMarkers = useMemo(() => {
    return parks
      .map(park => {
        const coords = parseCoords(park.latitude, park.longitude);
        if (!coords) return null;
        
        return {
          id: park.id,
          name: park.name,
          state: park.state,
          rating: park.rating,
          position: coords,
          isSelected: park.id === selectedParkId
        };
      })
      .filter(Boolean); // Remove null entries
  }, [parks, selectedParkId]);
  
  // Get coordinates for selected park
  const selectedPosition = useMemo(() => {
    if (!selectedPark) return null;
    return parseCoords(selectedPark.latitude, selectedPark.longitude);
  }, [selectedPark]);
  
  // Log coordinate info for debugging
  useEffect(() => {
    console.log(`Found ${validMarkers.length} valid markers out of ${parks.length} parks`);
    if (selectedPark) {
      console.log('Selected park coordinates:', {
        parkId: selectedPark.id,
        name: selectedPark.name,
        lat: selectedPark.latitude,
        lng: selectedPark.longitude
      });
    }
  }, [validMarkers.length, parks.length, selectedPark]);
  
  return (
    <div className="flex-1 relative overflow-hidden h-[calc(100vh-80px)]">
      <MapContainer 
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        className="absolute inset-0 z-0 h-full"
        style={{ height: "calc(100vh - 80px)" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Render only markers with valid coordinates */}
        {validMarkers.map(marker => (
          <Marker 
            key={marker.id}
            position={marker.position}
            icon={marker.isSelected ? selectedParkIcon : parkIcon}
            eventHandlers={{
              click: () => onSelectPark(marker.id)
            }}
          >
            <Popup>
              <div className="text-sm font-medium">
                <p className="font-bold">{marker.name}</p>
                <p className="text-xs">{marker.state}</p>
                <p className="text-xs">Rating: {marker.rating}/5</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Fly to selected park if coordinates are valid */}
        {selectedPosition && <FlyToMarker position={selectedPosition} />}
        
        <ZoomControl position="topright" />
      </MapContainer>
      
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