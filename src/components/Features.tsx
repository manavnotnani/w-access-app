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
      description: "Replace complex wallet addresses with simple, memorable names like 'alice.w-access'",
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
    <section className="py-24 bg-dark-surface/30 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-accent/5 to-transparent" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Why Choose <span className="bg-gradient-hero bg-clip-text text-transparent">W-Access</span>?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            We're revolutionizing Web3 onboarding with features that make wallet management as simple as email.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-gradient-card border-border/50 hover:border-gold/30 transition-all duration-300 hover:shadow-card group"
            >
              <CardContent className="p-8">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-hero rounded-xl flex items-center justify-center mr-4 group-hover:shadow-glow transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {feature.description}
                </p>

                <div className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center gap-3">
                      <CheckCircle className="w-4 h-4 text-gold flex-shrink-0" />
                      <span className="text-sm text-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-border/30">
                  <div className="flex items-center text-gold hover:text-gold-bright transition-colors cursor-pointer group">
                    <span className="text-sm font-medium">Learn more</span>
                    <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
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