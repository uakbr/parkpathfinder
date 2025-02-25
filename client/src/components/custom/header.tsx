import { useState } from "react";
import { Button } from "@/components/ui/button";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="bg-primary px-4 py-3 shadow-md z-10">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <i className="bx bxs-tree text-accent text-3xl mr-2"></i>
          <h1 className="text-background font-montserrat font-bold text-xl md:text-2xl">National Park Explorer</h1>
        </div>
        <div className="hidden md:flex items-center space-x-4">
          <button className="text-background hover:text-accent transition-colors font-montserrat text-sm font-medium">
            About
          </button>
          <button className="text-background hover:text-accent transition-colors font-montserrat text-sm font-medium">
            Parks List
          </button>
          <button className="text-background hover:text-accent transition-colors font-montserrat text-sm font-medium">
            My Trips
          </button>
          <Button
            variant="secondary"
            className="text-background font-montserrat"
          >
            Sign In
          </Button>
        </div>
        <button 
          className="md:hidden text-background text-2xl"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <i className="bx bx-menu"></i>
        </button>
      </div>
      
      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-primary z-20 shadow-md">
          <div className="flex flex-col px-4 py-2">
            <button className="text-background hover:text-accent transition-colors font-montserrat text-sm font-medium py-2 border-b border-secondary">
              About
            </button>
            <button className="text-background hover:text-accent transition-colors font-montserrat text-sm font-medium py-2 border-b border-secondary">
              Parks List
            </button>
            <button className="text-background hover:text-accent transition-colors font-montserrat text-sm font-medium py-2 border-b border-secondary">
              My Trips
            </button>
            <Button
              variant="secondary"
              className="mt-2 mb-2"
            >
              Sign In
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
