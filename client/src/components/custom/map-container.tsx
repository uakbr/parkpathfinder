import { ReactNode, useEffect, useState } from 'react';
import { MapContainer as LeafletMapContainer, MapContainerProps } from 'react-leaflet';
import { Loader2 } from "lucide-react";

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
      <div className="w-full h-full flex items-center justify-center bg-muted/10">
        <div className="text-center px-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
          <p className="text-sm font-medium text-muted-foreground">Initializing map...</p>
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