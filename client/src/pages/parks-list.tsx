import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/custom/header";
import { ParkCard } from "@/components/custom/park-card";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import type { Park } from "@/lib/types";

export default function ParksList() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: parks = [], isLoading } = useQuery<Park[]>({
    queryKey: ["parks"],
    queryFn: async () => {
      const response = await fetch("/api/parks");
      if (!response.ok) throw new Error("Failed to fetch parks");
      return response.json();
    },
  });

  const filteredParks = parks.filter(park =>
    park.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    park.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">All National Parks</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search parks by name or state..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </CardContent>
          </Card>

          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading parks...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredParks.map((park) => (
                <ParkCard
                  key={park.id}
                  park={park}
                  selectedMonth="September"
                  onSelect={() => {}}
                />
              ))}
            </div>
          )}

          {!isLoading && filteredParks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {searchTerm ? `No parks found matching "${searchTerm}"` : "No parks available"}
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}