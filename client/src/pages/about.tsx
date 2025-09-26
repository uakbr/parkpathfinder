import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Header } from "@/components/custom/header";

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <Card className="max-w-4xl mx-auto">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-center">About National Park Explorer</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-gray-700">
              Welcome to National Park Explorer, your comprehensive guide to discovering and planning 
              visits to America's most beautiful national parks.
            </p>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">What We Offer</h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Interactive maps of all national parks</li>
                <li>Monthly recommendations based on weather and seasonal activities</li>
                <li>AI-powered trip planning and personalized recommendations</li>
                <li>Detailed park information including activities and amenities</li>
                <li>Trip itinerary generation with suggested activities</li>
              </ul>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Our Mission</h2>
              <p className="text-gray-700">
                We believe everyone should have access to the natural wonders of our national parks. 
                Our platform makes it easy to discover, plan, and enjoy unforgettable experiences in 
                these protected landscapes.
              </p>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}