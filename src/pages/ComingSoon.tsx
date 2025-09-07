import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Clock, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gold/10 via-transparent to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
      
      <div className="container mx-auto px-6 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Back Button */}
          <div className="mb-8 flex justify-start">
            <Button 
              variant="ghost" 
              onClick={() => navigate(-1)}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              
            </Button>
          </div>

          {/* Main Content */}
          <Card className="bg-gradient-card border-border/50 shadow-card">
            <CardContent className="p-12">
              {/* Icon */}
              <div className="flex justify-center mb-8">
                <div className="w-24 h-24 bg-gradient-hero rounded-full flex items-center justify-center shadow-glow">
                  <Clock className="w-12 h-12 text-primary-foreground" />
                </div>
              </div>

              {/* Title */}
              <h1 className="text-5xl lg:text-6xl font-bold mb-6">
                <span className="bg-gradient-hero bg-clip-text text-transparent">Coming Soon</span>
              </h1>

              {/* Subtitle */}
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                We're working hard to bring you an amazing interactive demo experience. 
                Stay tuned for something truly special!
              </p>

              {/* Features Preview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="bg-background/50 rounded-xl p-6 border border-border/30">
                  <div className="w-12 h-12 bg-gradient-accent/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Sparkles className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-semibold mb-2">Interactive Demo</h3>
                  <p className="text-sm text-muted-foreground">
                    Experience the full wallet creation process
                  </p>
                </div>
                
                <div className="bg-background/50 rounded-xl p-6 border border-border/30">
                  <div className="w-12 h-12 bg-gradient-accent/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Sparkles className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-semibold mb-2">Live Preview</h3>
                  <p className="text-sm text-muted-foreground">
                    See your wallet name in action
                  </p>
                </div>
                
                <div className="bg-background/50 rounded-xl p-6 border border-border/30">
                  <div className="w-12 h-12 bg-gradient-accent/20 rounded-lg flex items-center justify-center mb-4 mx-auto">
                    <Sparkles className="w-6 h-6 text-gold" />
                  </div>
                  <h3 className="font-semibold mb-2">Step-by-Step</h3>
                  <p className="text-sm text-muted-foreground">
                    Guided walkthrough of the process
                  </p>
                </div>
              </div>

              {/* CTA */}
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  Want to be notified when it's ready?
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('/create-wallet')}
                    className="bg-gradient-hero text-primary-foreground hover:shadow-glow transition-all duration-300"
                  >
                    Create Your Wallet Now
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/')}
                    className="border-border/50 hover:border-gold/30"
                  >
                    Back to Home
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Note */}
          {/* <p className="text-sm text-muted-foreground mt-8">
            Expected launch: Q1 2024
          </p> */}
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;
