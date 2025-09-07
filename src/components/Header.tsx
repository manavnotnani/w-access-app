import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Names", href: "/names" },
    { name: "Recovery", href: "/recovery" }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img 
              src="/lovable-uploads/f03e8d40-ba1a-4f1e-a6c0-d0a28269e251.png" 
              alt="W-Access" 
              className="w-6 h-6 sm:w-8 sm:h-8"
            />
            <span className="text-lg sm:text-xl font-bold bg-gradient-hero bg-clip-text text-transparent whitespace-nowrap">
              W-ACCESS
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 text-sm font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center space-x-4">
            <Button 
              variant="outline" 
              size="sm"
              className="border-border bg-card/30 hover:bg-card/50"
            >
              <a href="/create-wallet">Create Wallet</a>
            </Button>
            <Button 
              size="sm"
              className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300"
            >
              <a href="/dashboard">Dashboard</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            ) : (
              <Menu className="w-5 h-5 sm:w-6 sm:h-6 text-foreground" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-card/50 backdrop-blur-fallback rounded-lg mt-2 border border-border/50">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block px-3 py-3 text-foreground/80 hover:text-foreground transition-colors duration-200 text-sm font-medium rounded-md hover:bg-card/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-2 px-3 pt-3 border-t border-border/30">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="border-border bg-card/30 hover:bg-card/50 w-full py-3"
                >
                  <a href="/create-wallet">Create Wallet</a>
                </Button>
                <Button 
                  size="sm"
                  className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 w-full py-3"
                >
                  <a href="/dashboard">Dashboard</a>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;