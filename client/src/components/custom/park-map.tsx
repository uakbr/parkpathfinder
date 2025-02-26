import { useState, useEffect, useMemo, useCallback } from "react";
import { TileLayer, Marker, Popup, useMap, ZoomControl, AttributionControl } from "react-leaflet";
import L from "leaflet";
import { ParkDetail } from "./park-detail";
import { Park } from "@/lib/types";
import { LazyMapContainer } from "./map-container";
import { Loader2 } from "lucide-react";

// Fix for Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom park icons - preload these images
const parkIconImage = new Image();
parkIconImage.src = 'https://cdn-icons-png.flaticon.com/512/5266/5266848.png';
const selectedParkIconImage = new Image();
selectedParkIconImage.src = 'https://cdn-icons-png.flaticon.com/512/5266/5266880.png';

// Create park icons after images have loaded
const parkIcon = new L.Icon({
  iconUrl: parkIconImage.src,
  iconSize: [25, 25],
  iconAnchor: [12, 25],
  popupAnchor: [0, -25]
});

const selectedParkIcon = new L.Icon({
  iconUrl: selectedParkIconImage.src,
  iconSize: [35, 35],
  iconAnchor: [17, 35],
  popupAnchor: [0, -35]
});

// Default center coordinates for USA
const DEFAULT_CENTER: [number, number] = [39.8283, -98.5795];
const DEFAULT_ZOOM = 4;
const MOBILE_ZOOM_ADJUST = -1; // Adjust zoom level for mobile

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

// Detect if we're on a mobile device
function isMobileDevice() {
  return window.innerWidth < 768;
}

// Component to fly to a marker on the map
function FlyToMarker({ position }: { position: [number, number] }) {
  const map = useMap();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Adjust zoom level for mobile devices
        const zoomLevel = isMobileDevice() ? 7 : 8;
        map.flyTo(position, zoomLevel, { animate: true, duration: 1.5 });
      } catch (error) {
        console.error('Error flying to position:', error);
      }
    }, 200);
    
    return () => clearTimeout(timer);
  }, [map, position]);
  
  return null;
}

// Simple button component for resetting map view
function ResetMapView() {
  const map = useMap();
  
  const handleResetView = useCallback(() => {
    // Reset to default view with appropriate zoom level
    const zoom = isMobileDevice() ? DEFAULT_ZOOM + MOBILE_ZOOM_ADJUST : DEFAULT_ZOOM;
    map.setView(DEFAULT_CENTER, zoom);
  }, [map]);

  return (
    <div className="leaflet-bottom leaflet-right" style={{ marginBottom: "50px" }}>
      <div className="leaflet-control leaflet-bar">
        <button
          onClick={handleResetView}
          className="w-[30px] h-[30px] bg-white flex items-center justify-center text-gray-700 border border-gray-300 rounded-sm shadow-sm hover:bg-gray-50 focus:outline-none"
          title="Reset map view"
          aria-label="Reset map view"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface ParkMapProps {
  parks: Park[];
  selectedParkId: number | null;
  selectedMonth: string;
  onSelectPark: (parkId: number) => void;
}

export function ParkMap({ parks, selectedParkId, selectedMonth, onSelectPark }: ParkMapProps) {
  // State
  const [isDataReady, setIsDataReady] = useState(false);
  const [isMapMounted, setIsMapMounted] = useState(false);
  const [initialLoadAttempted, setInitialLoadAttempted] = useState(false);
  
  // Find the selected park
  const selectedPark = parks.find(park => park.id === selectedParkId);
  
  // Get valid coordinates for parks
  const validMarkers = useMemo(() => {
    if (!parks || parks.length === 0) return [];
    
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
  
  // Mark data as ready once we have parks - even with 0 parks, we should proceed
  useEffect(() => {
    // Ensure we attempt to load data at least once
    if (!initialLoadAttempted) {
      setInitialLoadAttempted(true);
      
      // Wait a short time for data to potentially arrive
      const timer = setTimeout(() => {
        setIsDataReady(true);
      }, 500);
      
      return () => clearTimeout(timer);
    }
    
    // If parks data comes in later, just update that we're ready
    if (parks && !isDataReady) {
      setIsDataReady(true);
    }
  }, [parks, isDataReady, initialLoadAttempted]);
  
  // After component mounts, mark map as mounted
  useEffect(() => {
    setIsMapMounted(true);
  }, []);
  
  // Early fallback loading state
  if (!isMapMounted || !isDataReady) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-muted/30">
        <div className="text-center p-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }
  
  // Determine zoom level based on device
  const initialZoom = isMobileDevice() ? DEFAULT_ZOOM + MOBILE_ZOOM_ADJUST : DEFAULT_ZOOM;
  
  return (
    <div className="w-full h-full relative">
      <LazyMapContainer
        center={DEFAULT_CENTER}
        zoom={initialZoom}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maxZoom={18}
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
              <div className="text-sm font-medium p-1">
                <p className="font-bold">{marker.name}</p>
                <p className="text-xs">{marker.state}</p>
                <p className="text-xs">Rating: {marker.rating}/5</p>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Only fly to selected position if coordinates are valid */}
        {selectedPosition && <FlyToMarker position={selectedPosition} />}
        
        {/* Add reset view control */}
        <ResetMapView />
        
        {/* Position zoom control in the bottom right for mobile accessibility */}
        <ZoomControl position="bottomright" />
        
        {/* Move attribution to bottom left and make it more compact */}
        <AttributionControl position="bottomleft" prefix={false} />
      </LazyMapContainer>
      
      {/* Selected Park Detail Card */}
      {selectedPark && (
        <div className="absolute bottom-4 left-2 right-2 md:w-2/3 lg:w-1/2 xl:w-1/3 md:left-4 md:right-auto 
                         bg-white/95 backdrop-blur-sm rounded-lg shadow-lg border border-muted overflow-hidden z-10">
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