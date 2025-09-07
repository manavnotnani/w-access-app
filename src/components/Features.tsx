import { Card, CardContent } from "@/components/ui/card";
import { 
  User, 
  Shield, 
  Zap, 
  Key, 
  Globe, 
  Users,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const Features = () => {
  const features = [
    {
      icon: User,
      title: "Human-Readable Names",
      description: "Replace complex wallet addresses with simple, memorable names like 'alice.w-chain'",
      benefits: ["Easy to remember", "Typo-resistant", "Share with confidence"]
    },
    {
      icon: Shield,
      title: "Secure Recovery",
      description: "Advanced seed phrase protection with social recovery options",
      benefits: ["No more lost wallets", "Social backup", "Enterprise security"]
    },
    {
      icon: Zap,
      title: "Instant Creation",
      description: "Create wallets in seconds with our streamlined onboarding flow",
      benefits: ["One-click setup", "No technical knowledge", "Mobile optimized"]
    },
    {
      icon: Key,
      title: "Full Control",
      description: "Non-custodial design ensures you always own your assets",
      benefits: ["Your keys, your crypto", "No third-party risk", "True ownership"]
    },
    {
      icon: Globe,
      title: "W-Chain Native",
      description: "Built specifically for W-Chain's infrastructure and ecosystem",
      benefits: ["Optimized gas fees", "Native integration", "Future-proof"]
    },
    {
      icon: Users,
      title: "Mass Onboarding",
      description: "Enterprise-ready solution for bringing teams to Web3",
      benefits: ["Bulk creation", "Team management", "Admin controls"]
    }
  ];

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-dark-surface/30 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-accent/5 to-transparent" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-8 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 px-2">
            Why Choose <span className="bg-gradient-hero bg-clip-text text-transparent">W-Access</span>?
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-4 sm:px-2">
            We're revolutionizing Web3 onboarding with features that make wallet management as simple as email.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-card group h-full"
            >
              <CardContent className="p-4 sm:p-6 md:p-8 h-full flex flex-col">
                <div className="flex items-start sm:items-center mb-4 sm:mb-6">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-hero rounded-lg sm:rounded-xl flex items-center justify-center mr-3 sm:mr-4 group-hover:shadow-glow transition-all duration-300 flex-shrink-0">
                    <feature.icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-foreground leading-tight">{feature.title}</h3>
                </div>
                
                <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed flex-grow">
                  {feature.description}
                </p>

                <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-start gap-2 sm:gap-3">
                      <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-gold flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-foreground leading-relaxed">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-auto pt-4 sm:pt-6 border-t border-border/30">
                  <div className="flex items-center text-gold hover:text-gold-bright transition-colors cursor-pointer group">
                    <span className="text-xs sm:text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;