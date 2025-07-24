import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-blue-accent/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-4xl mx-auto animate-fade-up">
          {/* Logo */}
          <div className="mb-8">
            <img 
              src="/lovable-uploads/f03e8d40-ba1a-4f1e-a6c0-d0a28269e251.png" 
              alt="W-Access Logo" 
              className="w-32 h-32 mx-auto animate-float"
            />
          </div>

          {/* Main Headline */}
          <h1 className="text-6xl lg:text-7xl font-bold mb-6 bg-gradient-hero bg-clip-text text-transparent leading-tight">
            Confusing wallet UX?
            <br />
            <span className="text-foreground">Gone.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl lg:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            W-Access introduces human-readable wallet names and simplified creation for mass onboarding to Web3.
          </p>

          {/* Key Features */}
          <div className="flex flex-wrap justify-center gap-6 mb-12">
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
              <Shield className="w-5 h-5 text-gold" />
              <span className="text-sm font-medium">Non-Custodial Security</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
              <Zap className="w-5 h-5 text-blue-accent" />
              <span className="text-sm font-medium">Instant Setup</span>
            </div>
            <div className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-2 rounded-full border border-border">
              <Users className="w-5 h-5 text-gold" />
              <span className="text-sm font-medium">Mass Onboarding</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300 animate-glow-pulse px-8 py-4 text-lg font-semibold"
            >
              Get Early Access
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="border-border bg-card/30 backdrop-blur-sm hover:bg-card/50 px-8 py-4 text-lg"
            >
              View Demo
            </Button>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gold mb-2">90%</div>
              <div className="text-muted-foreground">Faster Onboarding</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-accent mb-2">0</div>
              <div className="text-muted-foreground">Seed Phrase Confusion</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gold mb-2">100%</div>
              <div className="text-muted-foreground">User Control</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;