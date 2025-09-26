import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { AlertCircle, Home, Map, Calendar } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md mx-4">
        <CardContent className="pt-6">
          <div className="flex mb-4 gap-2">
            <AlertCircle className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-gray-900">404 Page Not Found</h1>
          </div>

          <p className="mt-4 text-sm text-gray-600 mb-6">
            Sorry, we couldn't find the page you're looking for. The page may have been moved, deleted, or you may have entered an incorrect URL.
          </p>

          <div className="space-y-3">
            <Link href="/">
              <Button className="w-full" variant="default">
                <Home className="h-4 w-4 mr-2" />
                Go to Home Page
              </Button>
            </Link>
            
            <div className="grid grid-cols-2 gap-2">
              <Link href="/parks">
                <Button variant="outline" className="w-full">
                  <Map className="h-4 w-4 mr-1" />
                  Parks List
                </Button>
              </Link>
              <Link href="/trips">
                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-1" />
                  My Trips
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
