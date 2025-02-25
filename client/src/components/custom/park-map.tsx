import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { ParkDetail } from "./park-detail";
import { Park } from "@/lib/types";
import { getMapCenter, getMapZoom, safeCoordinates } from "@/lib/utils";

// Fix for Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Simple tree icons for park markers
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

// We use the safeCoordinates function from utils.ts

// Component to handle map centering on a marker
function FlyToMarker({ lat, lng }: { lat: number, lng: number }) {
  const map = useMap();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        map.flyTo([lat, lng], 7, {
          animate: true,
          duration: 1.5
        });
      } catch (error) {
        console.error("Error flying to marker:", error);
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [map, lat, lng]);
  
  return null;
}

interface ParkMapProps {
  parks: Park[];
  selectedParkId: number | null;
  selectedMonth: string;
  onSelectPark: (parkId: number) => void;
}

export function ParkMap({ parks, selectedParkId, selectedMonth, onSelectPark }: ParkMapProps) {
  const defaultCenter = getMapCenter();
  const defaultZoom = getMapZoom();
  const selectedPark = parks.find(park => park.id === selectedParkId);
  
  return (
    <div className="flex-1 relative overflow-hidden h-[calc(100vh-80px)]">
      <MapContainer 
        center={[defaultCenter.lat, defaultCenter.lng]} 
        zoom={defaultZoom} 
        className="absolute inset-0 z-0 h-full"
        style={{ height: "calc(100vh - 80px)" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Park markers */}
        {parks.map(park => {
          const isSelected = park.id === selectedParkId;
          const coordinates = safeCoordinates(park.latitude, park.longitude);
          
          // Skip invalid coordinates
          if (!coordinates) return null;
          
          return (
            <Marker 
              key={park.id}
              position={coordinates}
              icon={isSelected ? selectedParkIcon : parkIcon}
              eventHandlers={{
                click: () => onSelectPark(park.id)
              }}
            >
              <Popup>
                <div className="text-sm font-medium">
                  <p className="font-bold">{park.name}</p>
                  <p className="text-xs">{park.state}</p>
                  <p className="text-xs">Rating: {park.rating}/5</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
        
        {/* Fly to selected park */}
        {selectedPark && (() => {
          const coords = safeCoordinates(selectedPark.latitude, selectedPark.longitude);
          if (!coords) return null;
          return <FlyToMarker lat={coords[0]} lng={coords[1]} />;
        })()}
        
        {/* Custom zoom controls */}
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