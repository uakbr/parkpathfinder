import { ReactNode, useEffect, useState, useRef } from 'react';
import { MapContainer as LeafletMapContainer, MapContainerProps } from 'react-leaflet';
import { Loader2 } from "lucide-react";
import L from 'leaflet';

// This is an enhanced wrapper that ensures the map loads properly
export function LazyMapContainer({ children, ...props }: MapContainerProps & { children: ReactNode }) {
  const [isMapReady, setIsMapReady] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInitialized = useRef(false);
  
  useEffect(() => {
    // Make sure Leaflet styles are loaded
    if (typeof document !== 'undefined') {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
      link.crossOrigin = '';
      document.head.appendChild(link);
    }

    // Setup map with proper delay to ensure DOM is ready
    if (!mapInitialized.current) {
      const timer = setTimeout(() => {
        // Invalidate map size when it becomes visible
        if (mapContainerRef.current) {
          // Fix for mobile devices - force redraw
          mapContainerRef.current.style.display = 'none';
          setTimeout(() => {
            if (mapContainerRef.current) {
              mapContainerRef.current.style.display = 'block';
              setIsMapReady(true);
              mapInitialized.current = true;
            }
          }, 50);
        } else {
          setIsMapReady(true);
          mapInitialized.current = true;
        }
      }, 150);
      
      return () => clearTimeout(timer);
    }
  }, []);
  
  // Use this cleanup function when component unmounts
  useEffect(() => {
    return () => {
      mapInitialized.current = false;
    };
  }, []);

  if (!isMapReady) {
    return (
      <div 
        ref={mapContainerRef} 
        className="w-full h-full flex items-center justify-center bg-muted/5"
      >
        <div className="text-center px-4 py-8">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Loading map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-full">
      <LeafletMapContainer 
        {...props}
        whenReady={() => {
          // Force the map to recalculate its size
          setTimeout(() => {
            if (mapContainerRef.current) {
              window.dispatchEvent(new Event('resize'));
            }
          }, 200);
        }}
      >
        {children}
      </LeafletMapContainer>
    </div>
  );
}