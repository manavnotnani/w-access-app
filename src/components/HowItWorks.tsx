import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MousePointer, UserCheck, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const HowItWorks = () => {
  const navigate = useNavigate();
  
  const steps = [
    {
      step: "01",
      icon: MousePointer,
      title: "Choose Your Name",
      description: "Pick a human-readable name like 'alice.w-chain' or 'company.w-chain'",
      highlight: "Simple & Memorable"
    },
    {
      step: "02", 
      icon: UserCheck,
      title: "Secure Setup",
      description: "Set up recovery options with social backup or security questions",
      highlight: "Never Lose Access"
    },
    {
      step: "03",
      icon: Wallet,
      title: "Start Using",
      description: "Your wallet is ready! Share your name and start receiving payments",
      highlight: "Ready in Seconds"
    }
  ];

  return (
    <section className="py-24 bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Get Started in <span className="bg-gradient-hero bg-clip-text text-transparent">3 Simple Steps</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            No complex seed phrases, no confusing addresses. Just simple, secure wallet creation.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-gradient-card border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-card h-full">
                  <CardContent className="p-8 text-center">
                    {/* Step Number */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-hero rounded-full mb-6 mx-auto shadow-glow">
                      <span className="text-2xl font-bold text-primary-foreground">{step.step}</span>
                    </div>

                    {/* Icon */}
                    <div className="flex justify-center mb-6">
                      <div className="w-16 h-16 bg-card/50 rounded-xl flex items-center justify-center border border-border/30">
                        <step.icon className="w-8 h-8 text-gold" />
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-2xl font-semibold mb-4 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{step.description}</p>
                    
                    {/* Highlight */}
                    <div className="inline-block bg-gradient-accent/10 text-gold px-4 py-2 rounded-full border border-gold/20">
                      <span className="text-sm font-medium">{step.highlight}</span>
                    </div>
                  </CardContent>
                </Card>

                {/* Arrow connector (hidden on mobile) */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-6 transform -translate-y-1/2 z-10">
                    <ArrowRight className="w-8 h-8 text-gold/50" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Demo Section */}
          <div className="mt-20 text-center">
            <div className="bg-gradient-card border border-border/50 rounded-2xl p-8 max-w-2xl mx-auto shadow-card">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">See It In Action</h3>
              <p className="text-muted-foreground mb-6">
                Watch how easy it is to create your first W-Access wallet
              </p>
              
              {/* Mock Demo Preview */}
              <div className="bg-background/50 rounded-xl p-6 border border-border/30 mb-6">
                <div className="flex items-center justify-center space-x-2 text-lg">
                  <span className="text-muted-foreground">Your wallet:</span>
                  <span className="bg-gradient-hero bg-clip-text text-transparent font-bold">alice.w-chain</span>
                </div>
                <div className="text-sm text-muted-foreground mt-2 text-center">
                  <span className="hidden sm:inline">Instead of: 0x742d35cc6b19c6b6d5f5b9ff5c5f5d5f5d5f5d5f</span>
                  <span className="sm:hidden">Instead of: 0x742d...5d5f</span>
                </div>
              </div>

              <Button 
                onClick={() => navigate('/coming-soon')}
                className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300"
              >
                Try Interactive Demo
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;