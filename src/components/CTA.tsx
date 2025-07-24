import { Button } from "@/components/ui/button";
import { ArrowRight, Mail, Twitter, Github } from "lucide-react";

const CTA = () => {
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
              Ready to <span className="bg-gradient-hero bg-clip-text text-transparent">Simplify Web3</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Join the waitlist for W-Access and be among the first to experience frictionless Web3 onboarding.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 animate-glow-pulse px-8 py-4 text-lg font-semibold"
              >
                Join Waitlist
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-border bg-card/30 backdrop-blur-sm hover:bg-card/50 px-8 py-4 text-lg"
              >
                Contact Team
              </Button>
            </div>

            {/* Early Access Benefits */}
            <div className="bg-gradient-card border border-gold/20 rounded-2xl p-6 max-w-2xl mx-auto shadow-card">
              <h3 className="text-lg font-semibold mb-4 text-gold">Early Access Benefits</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>Priority wallet creation</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-accent rounded-full"></div>
                  <span>Exclusive features</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gold rounded-full"></div>
                  <span>Community access</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-accent rounded-full"></div>
                  <span>Direct team support</span>
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
              <Button variant="outline" size="sm" className="border-border bg-card/30 hover:bg-card/50">
                <Twitter className="w-4 h-4 mr-2" />
                Twitter
              </Button>
              <Button variant="outline" size="sm" className="border-border bg-card/30 hover:bg-card/50">
                <Github className="w-4 h-4 mr-2" />
                GitHub
              </Button>
              <Button variant="outline" size="sm" className="border-border bg-card/30 hover:bg-card/50">
                <Mail className="w-4 h-4 mr-2" />
                Email
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTA;