//Final
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Zap, Users } from "lucide-react";
import { motion , Variants } from "framer-motion";

const Hero = () => {
  // Fixed variants with proper easing types
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const childVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" // This is the correct easing function
      },
    },
  };

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold/10 via-background to-blue-accent/10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold/5 via-transparent to-transparent" />
      {/* Grid pattern - make sure to create this file */}

      <div className="container mx-auto px-6 relative z-20 pt-16 pb-16">
        <motion.div
          className="text-center max-w-4xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Logo */}
          <div className="mb-8 mt-5">
            <img 
              src="/lovable-uploads/transparent_logo.png" 
              alt="W-Access Logo" 
              className="w-32 h-32 mx-auto animate-float mix-blend-multiply dark:mix-blend-screen"
            />
          </div>

          {/* Main Headline */}
          <motion.h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight"
            variants={childVariants}
          >
            <span className="block bg-gradient-to-r from-gold to-blue-accent bg-clip-text text-transparent pb-5">
              Simplifying Web3 for Everyone on W-Chain
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            className="text-xl lg:text-2xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed"
            variants={childVariants}
          >
            Experience seamless wallet creation, human-readable addresses, and
            secure management – making mass adoption a reality.
          </motion.p>

          {/* Key Features */}
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-12"
            variants={containerVariants}
          >
            {[
              {
                icon: <Shield className="w-5 h-5 text-gold" />,
                text: "Your Keys, Your Control",
              },
              {
                icon: <Zap className="w-5 h-5 text-blue-accent" />,
                text: "Lightning-Fast Setup",
              },
              {
                icon: <Users className="w-5 h-5 text-gold" />,
                text: "Designed for Everyone",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                className="flex items-center gap-2 bg-card/50 backdrop-blur-sm px-4 py-3 rounded-full border border-border"
                variants={childVariants}
                whileHover={{
                  y: -3,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderColor: "rgba(245, 180, 0, 0.5)",
                }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                {feature.icon}
                <span className="text-sm font-medium">{feature.text}</span>
              </motion.div>
            ))}
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
            variants={childVariants}
          >
            <Button
              size="lg"
              className="group relative bg-gradient-to-r from-gold to-blue-accent text-primary-foreground px-8 py-5 text-lg font-semibold overflow-hidden"
              asChild
            >
              <a href="/create-wallet">
                <span className="relative z-10">Get Started Now</span>
                <ArrowRight className="ml-2 w-5 h-5 z-10 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-gradient-to-r from-blue-accent to-gold opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-5 text-lg bg-transparent border-2 border-gold/40 hover:border-blue-accent group transition-colors"
              onClick={scrollToFeatures}
            >
              <span className="bg-gradient-to-r from-gold to-blue-accent bg-clip-text text-transparent group-hover:from-blue-accent group-hover:to-gold transition-all">
                Explore Features
              </span>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            variants={containerVariants}
          >
            {[
              { value: "90%", label: "Faster Onboarding", color: "text-gold" },
              {
                value: "0",
                label: "Seed Phrase Confusion",
                color: "text-blue-accent",
              },
              { value: "100%", label: "User Control", color: "text-gold" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="text-center p-6 bg-card/30 backdrop-blur-sm rounded-2xl border border-border/50"
                variants={childVariants}
                whileHover={{
                  y: -5,
                  borderColor: "rgba(245, 180, 0, 0.3)",
                  boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.1)",
                }}
              >
                <div
                  className="text-4xl font-bold mb-2"
                  style={{
                    background: `linear-gradient(135deg, ${
                      stat.color === "text-gold" ? "#F5B400" : "#3B82F6"
                    }, ${stat.color === "text-gold" ? "#F59E0B" : "#60A5FA"})`,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Social Proof */}
          <motion.div
            className="mt-16 bg-card/30 backdrop-blur-sm p-6 rounded-xl border border-border max-w-2xl mx-auto"
            variants={childVariants}
            whileHover={{
              backgroundColor: "rgba(255, 255, 255, 0.05)",
              borderColor: "rgba(245, 180, 0, 0.3)",
            }}
          >
            <p className="text-muted-foreground italic mb-4">
              "Finally, wallet onboarding my parents could understand. This
              changes everything."
            </p>
            <div className="flex items-center justify-center gap-3">
              <div className="bg-gray-200 border-2 border-dashed rounded-xl w-10 h-10" />
              <div>
                <p className="font-medium text-foreground">Alex Rivera</p>
                <p className="text-sm text-muted-foreground">
                  Early Tester, Web3 Educator
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
