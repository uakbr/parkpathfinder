import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import { ParkDetail } from "./park-detail";
import { Park } from "@/lib/types";
import { getMapCenter, getMapZoom } from "@/lib/utils";

// Fix for Leaflet marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const parkIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/9833/9833221.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const selectedParkIcon = new L.Icon({
  iconUrl: 'https://cdn-icons-png.flaticon.com/512/9833/9833221.png',
  iconSize: [48, 48],
  iconAnchor: [24, 48],
  popupAnchor: [0, -48]
});

interface ParkMapProps {
  parks: Park[];
  selectedParkId: number | null;
  selectedMonth: string;
  onSelectPark: (parkId: number) => void;
}

export function ParkMap({ parks, selectedParkId, selectedMonth, onSelectPark }: ParkMapProps) {
  const mapCenter = getMapCenter();
  const mapZoom = getMapZoom();
  const selectedPark = parks.find(park => park.id === selectedParkId);

  // Function to center map on specific park
  function FlyToMarker({ lat, lng }: { lat: number, lng: number }) {
    const map = useMap();
    useEffect(() => {
      if (lat && lng) {
        map.flyTo([lat, lng], 7, {
          animate: true,
          duration: 1.5
        });
      }
    }, [map, lat, lng]);
    return null;
  }
  
  return (
    <div className="flex-1 relative overflow-hidden">
      <MapContainer 
        center={[mapCenter.lat, mapCenter.lng]} 
        zoom={mapZoom} 
        className="absolute inset-0 z-0"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Create markers for each park */}
        {parks.map(park => {
          const isSelected = park.id === selectedParkId;
          const lat = parseFloat(park.latitude);
          const lng = parseFloat(park.longitude);
          
          return (
            <Marker 
              key={park.id}
              position={[lat, lng]}
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
        
        {/* Fly to selected park if any */}
        {selectedPark && (
          <FlyToMarker 
            lat={parseFloat(selectedPark.latitude)}
            lng={parseFloat(selectedPark.longitude)}
          />
        )}
        
        {/* Custom zoom controls added to map */}
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
