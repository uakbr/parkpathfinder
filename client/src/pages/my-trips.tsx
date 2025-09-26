import { Header } from "@/components/custom/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Users } from "lucide-react";

export default function MyTrips() {
  // Mock trip data - in a real app this would come from an API
  const trips = [
    {
      id: 1,
      parkName: "Yellowstone National Park",
      dates: "July 15-20, 2024",
      travelers: 4,
      status: "upcoming"
    },
    {
      id: 2,
      parkName: "Grand Canyon National Park", 
      dates: "September 8-12, 2024",
      travelers: 2,
      status: "completed"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">My Trips</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-gray-600">
                Plan and manage your national park adventures
              </p>
            </CardContent>
          </Card>

          {trips.length > 0 ? (
            <div className="space-y-6">
              {trips.map((trip) => (
                <Card key={trip.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div className="space-y-3">
                        <h3 className="text-xl font-semibold">{trip.parkName}</h3>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>{trip.dates}</span>
                          </div>
                          
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{trip.travelers} travelers</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            trip.status === 'upcoming' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {trip.status === 'upcoming' ? 'Upcoming' : 'Completed'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <MapPin className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        {trip.status === 'upcoming' && (
                          <Button size="sm">
                            Edit Trip
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MapPin className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No trips yet</h3>
                <p className="text-gray-500 mb-6">Start planning your first national park adventure!</p>
                <Button>
                  Plan Your First Trip
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}