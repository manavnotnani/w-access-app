import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Twitter, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ContactModal from "./ContactModal";

const CTA = () => {
  const navigate = useNavigate();
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const handleCreateWallet = () => {
    navigate('/create-wallet');
  };

  const handleContactTeam = () => {
    setIsContactModalOpen(true);
  };

  const handleTwitterClick = () => {
    window.open('https://twitter.com/heymanavv', '_blank');
  };

  const handleGithubClick = () => {
    window.open('https://github.com/manavnotnani', '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:manav.notnani@gmail.com', '_blank');
  };

  return (
    <section className="py-24 bg-gradient-to-br from-dark-surface via-background to-dark-surface relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-blue-accent/10" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gold/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main CTA */}
          <div className="mb-16">
            <h2 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Ready to <span className="bg-gradient-hero bg-clip-text text-transparent">Enter Web3</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Create your first wallet now and join the W-Access ecosystem. Experience frictionless Web3 onboarding today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 animate-glow-pulse px-8 py-4 text-lg font-semibold"
                onClick={handleCreateWallet}
              >
                Create Your First Wallet
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-border bg-card/30 backdrop-blur-sm hover:bg-card/50 px-8 py-4 text-lg"
                onClick={handleContactTeam}
              >
                Contact Team
              </Button>
            </div>

            {/* Wallet Creation Benefits */}
            <div className="bg-gradient-card border border-gold/20 rounded-2xl p-6 max-w-2xl mx-auto shadow-card">
              <h3 className="text-lg font-semibold mb-4 text-gold">What You Get</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>Secure wallet creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-accent rounded-full"></div>
                  <span>Easy recovery options</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>Multi-chain support</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-accent rounded-full"></div>
                  <span>24/7 ecosystem access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connect Section */}
          <div className="border-t border-border/30 pt-16">
            <h3 className="text-2xl font-semibold mb-6 text-foreground">Stay Connected</h3>
            <p className="text-muted-foreground mb-8">
              Follow our journey and get updates on W-Access development
            </p>
            
            <div className="flex justify-center space-x-6">
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border bg-card/30 hover:bg-card/50"
                onClick={handleTwitterClick}
              >
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border bg-card/30 hover:bg-card/50"
                onClick={handleGithubClick}
              >
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="border-border bg-card/30 hover:bg-card/50"
                onClick={handleEmailClick}
              >
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Team Modal */}
      <ContactModal 
        isOpen={isContactModalOpen} 
        onOpenChange={setIsContactModalOpen} 
      />
    </section>
  );
};

export default CTA;