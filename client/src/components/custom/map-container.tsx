import { ReactNode, useEffect, useState } from 'react';
import { MapContainer as LeafletMapContainer, MapContainerProps } from 'react-leaflet';

// This is a wrapper that ensures the map only renders when data is ready
export function LazyMapContainer({ children, ...props }: MapContainerProps & { children: ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure all DOM elements are ready
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (!isMounted) {
    return (
      <div 
        className="absolute inset-0 z-0 h-full bg-gray-100 flex items-center justify-center"
        style={{ height: "calc(100vh - 80px)" }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }
  
  return (
    <LeafletMapContainer {...props}>
      {children}
    </LeafletMapContainer>
  );
}