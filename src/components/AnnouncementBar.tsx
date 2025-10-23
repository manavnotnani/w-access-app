import { Button } from "@/components/ui/button";
import { ExternalLink, Sparkles } from "lucide-react";

const AnnouncementBar = () => {
  const handleContractClick = () => {
    window.open("https://scan.w-chain.com/address/0xbcBC65828Afea72b83C8a07666226d3319739b62", "_blank");
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 via-purple-600 to-gold text-white py-1 px-4 overflow-hidden z-[60]">
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-gold/20 animate-pulse" />
      
      <div className="max-w-4xl mx-auto flex items-center justify-center space-x-1 sm:space-x-2 relative z-10">
        {/* Icon */}
        <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 animate-pulse" />
        
        {/* Main message */}
        <span className="text-xs sm:text-sm font-medium text-center">
          🚀 Launching soon on W-Chain Mainnet!
        </span>
        
        {/* Contract link button */}
        <Button
          onClick={handleContractClick}
          variant="outline"
          size="sm"
          className="bg-white/10 border-white/20 text-white hover:bg-white/20 hover:text-white transition-all duration-200 backdrop-blur-sm h-6 px-2 text-xs"
        >
          <span className="hidden sm:inline">View W-Access Registry Contract</span>
          <span className="sm:hidden">Contract</span>
          <ExternalLink className="w-2 h-2 ml-1" />
        </Button>
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
