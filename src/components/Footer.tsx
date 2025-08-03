import { Twitter, Github, Mail, Globe } from "lucide-react";

const Footer = () => {
  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "#how-it-works" },
      { name: "Pricing", href: "#pricing" },
      { name: "Demo", href: "#demo" }
    ],
    Resources: [
      { name: "Documentation", href: "#docs" },
      { name: "API Reference", href: "#api" },
      { name: "Community", href: "#community" },
      { name: "Support", href: "#support" }
    ],
    Company: [
      { name: "About", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Careers", href: "#careers" },
      { name: "Contact", href: "#contact" }
    ]
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "GitHub", icon: Github, href: "#" },
    { name: "Email", icon: Mail, href: "#" },
    { name: "Website", icon: Globe, href: "#" }
  ];

  return (
    <footer className="bg-dark-surface border-t border-border/50">
      <div className="container mx-auto px-6">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-6">
                <img 
                  src="/lovable-uploads/f03e8d40-ba1a-4f1e-a6c0-d0a28269e251.png" 
                  alt="W-Access" 
                  className="w-10 h-10"
                />
                <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  W-ACCESS
                </span>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Simplifying Web3 wallet creation and management with human-readable names and secure recovery options.
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-card/30 hover:bg-card/50 border border-border/30 hover:border-gold/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-glow"
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground hover:text-gold" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-foreground mb-6">{category}</h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={link.href}
                        className="text-muted-foreground hover:text-gold transition-colors duration-200"
                      >
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border/30 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-muted-foreground text-sm">
              © 2025 W-Access. Built for W-Chain. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 text-sm">
              <a href="#privacy" className="text-muted-foreground hover:text-gold transition-colors">
                Privacy Policy
              </a>
              <a href="#terms" className="text-muted-foreground hover:text-gold transition-colors">
                Terms of Service
              </a>
              <div className="flex items-center space-x-2 text-muted-foreground">
                <span>Built on</span>
                <span className="text-blue-accent font-medium">W-Chain</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;