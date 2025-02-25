import { cn } from "@/lib/utils";
import { formatNumberWithCommas } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Park } from "@/lib/types";

interface ParkCardProps {
  park: Park;
  isSelected: boolean;
  onClick: () => void;
}

export function ParkCard({ park, isSelected, onClick }: ParkCardProps) {
  return (
    <div 
      className={cn(
        "bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow p-3 cursor-pointer border",
        isSelected ? "border-primary" : "border-gray-100"
      )}
      onClick={onClick}
    >
      <div className="flex">
        <img
          src={park.image_url}
          alt={park.name}
          className="w-16 h-16 object-cover rounded mr-3"
          loading="lazy"
        />
        <div>
          <h3 className="font-montserrat font-semibold text-primary">
            {park.name}
          </h3>
          <div className="flex items-center text-xs text-gray-600 mt-1">
            <span className="mr-2">
              <i className="bx bxs-map text-secondary"></i> {park.state}
            </span>
            <span>
              <i className="bx bxs-star text-yellow-500"></i> {park.rating}
            </span>
          </div>
          <div className="flex mt-1 flex-wrap gap-1">
            {park.activities.slice(0, 2).map((activity) => (
              <Badge key={activity} variant="green" className="mr-1 text-[10px]">
                {activity}
              </Badge>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
