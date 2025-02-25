import { useState, useEffect, useMemo } from "react";
import { TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { ParkDetail } from "./park-detail";
import { Park } from "@/lib/types";
import { LazyMapContainer } from "./map-container";

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
function parseCoordinates(lat: string | number | undefined, lng: string | number | undefined): [number, number] | null {
  if (lat === undefined || lng === undefined) return null;
  
  try {
    const numLat = typeof lat === 'string' ? parseFloat(lat) : Number(lat);
    const numLng = typeof lng === 'string' ? parseFloat(lng) : Number(lng);
    
    if (isNaN(numLat) || isNaN(numLng)) return null;
    if (numLat < -90 || numLat > 90 || numLng < -180 || numLng > 180) return null;
    
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
    const timer = setTimeout(() => {
      try {
        map.flyTo(position, 8, { animate: true, duration: 1.5 });
      } catch (error) {
        console.error('Error flying to position:', error);
      }
    }, 100);
    
    return () => clearTimeout(timer);
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
  // Wait for data to be available
  const [isDataReady, setIsDataReady] = useState(false);
  
  // Find the selected park
  const selectedPark = parks.find(park => park.id === selectedParkId);
  
  // Get valid coordinates for parks
  const validMarkers = useMemo(() => {
    if (parks.length === 0) return [];
    
    // Filter parks with valid coordinates
    const markers = [];
    
    for (const park of parks) {
      const coords = parseCoordinates(park.latitude, park.longitude);
      if (coords) {
        markers.push({
          id: park.id,
          name: park.name,
          state: park.state,
          rating: park.rating,
          position: coords,
          isSelected: park.id === selectedParkId
        });
      }
    }
    
    return markers;
  }, [parks, selectedParkId]);
  
  // Get coordinates for selected park
  const selectedPosition = useMemo(() => {
    if (!selectedPark) return null;
    return parseCoordinates(selectedPark.latitude, selectedPark.longitude);
  }, [selectedPark]);
  
  // Mark data as ready once we have parks
  useEffect(() => {
    if (parks.length > 0 && !isDataReady) {
      setIsDataReady(true);
    }
  }, [parks, isDataReady]);
  
  // Loading state
  if (!isDataReady) {
    return (
      <div className="flex-1 relative overflow-hidden h-[calc(100vh-80px)] bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex-1 relative overflow-hidden h-[calc(100vh-80px)]">
      <LazyMapContainer
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
        
        {/* Only render markers with valid coordinates */}
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
        
        {/* Only fly to selected position if coordinates are valid */}
        {selectedPosition && <FlyToMarker position={selectedPosition} />}
        
        <ZoomControl position="topright" />
      </LazyMapContainer>
      
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