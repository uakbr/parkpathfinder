import { Marker } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ParkMarkerProps {
  marker: Marker;
  position: { top: string; left: string };
  onClick: () => void;
}

export function ParkMarker({ marker, position, onClick }: ParkMarkerProps) {
  return (
    <div
      className="park-marker absolute cursor-pointer z-10"
      style={{ top: position.top, left: position.left }}
      onClick={onClick}
    >
      {marker.isSelected ? (
        <div className="relative">
          <div className="bg-secondary text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg border-2 border-white">
            <i className="bx bxs-tree text-lg"></i>
          </div>
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full shadow-md whitespace-nowrap font-montserrat font-medium text-xs text-primary">
            {marker.name}
          </div>
        </div>
      ) : (
        <div className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg hover:scale-125 transition-transform">
          <i className="bx bxs-tree"></i>
        </div>
      )}
    </div>
  );
}
