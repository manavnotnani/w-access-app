import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRightLeft } from "lucide-react";
import { 
  getCurrentNetworkName, 
  getOppositeNetworkName, 
  getOppositeNetworkUrl, 
  shouldShowNetworkSwitcher 
} from "@/lib/network";

const AnnouncementBar = () => {
  const handleNetworkSwitch = () => {
    const oppositeUrl = getOppositeNetworkUrl();
    if (oppositeUrl) {
      window.location.href = oppositeUrl;
    }
  };

  const currentNetwork = getCurrentNetworkName();
  const oppositeNetwork = getOppositeNetworkName();
  const showSwitcher = shouldShowNetworkSwitcher();

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-purple-600 to-gold text-white py-1 px-4 overflow-hidden z-[60]">
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-gold/20 animate-pulse" />
      
      <div className="max-w-4xl mx-auto flex items-center justify-center space-x-1 sm:space-x-2 relative z-10">
        {/* Icon */}
        
        
        {/* Main message with glittery effect */}
        <span className="text-xs sm:text-sm font-medium text-center bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 bg-clip-text text-transparent animate-pulse">
          🚀 Now live on W-Chain {currentNetwork}!
        </span>
        

        {/* Network switcher button - always show if URLs are configured */}
        {showSwitcher && (
          <Button
            onClick={handleNetworkSwitch}
            variant="outline"
            size="sm"
            className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm h-6 px-2 text-xs"
          >
            <span className="hidden sm:inline">Switch to {oppositeNetwork}</span>
            <span className="sm:hidden">{oppositeNetwork}</span>
            <ArrowRightLeft className="w-2 h-2 ml-1" />
          </Button>
        )}
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-1 left-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0s' }} />
        <div className="absolute top-1 right-1/4 w-2 h-2 bg-white/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }} />
        <div className="absolute bottom-1 left-1/3 w-1 h-1 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-1 right-1/3 w-1 h-1 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }} />
      </div>
    </div>
  );
};

export default AnnouncementBar;
