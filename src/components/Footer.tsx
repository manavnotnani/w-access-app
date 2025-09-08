import { Twitter, Github, Mail, Globe } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ContactModal from "./ContactModal";

const Footer = () => {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const navigate = useNavigate();

  const footerLinks = {
    Product: [
      { name: "Features", href: "#features" },
      { name: "How It Works", href: "/coming-soon", isComingSoon: true },
      { name: "Pricing", href: "/coming-soon", isComingSoon: true },
      { name: "Demo", href: "/coming-soon", isComingSoon: true },
    ],
    Resources: [
      { name: "Documentation", href: "/coming-soon", isComingSoon: true },
      { name: "API Reference", href: "/coming-soon", isComingSoon: true },
      { name: "Community", href: "/coming-soon", isComingSoon: true },
      { name: "Support", href: "/coming-soon", isComingSoon: true },
    ],
    Company: [
      { name: "About", href: "/coming-soon", isComingSoon: true },
      { name: "Blog", href: "/coming-soon", isComingSoon: true },
      { name: "Careers", href: "/coming-soon", isComingSoon: true },
      { name: "Contact", href: "#contact", isModal: true },
    ],
  };

  const handleLinkClick = (link: any) => {
    if (link.isModal) {
      setIsContactModalOpen(true);
    } else if (link.isComingSoon) {
      navigate("/coming-soon");
    }
  };

  const socialLinks = [
    { name: "Twitter", icon: Twitter, href: "#" },
    { name: "GitHub", icon: Github, href: "#" },
    { name: "Email", icon: Mail, href: "#" },
    { name: "Website", icon: Globe, href: "#" },
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
                Simplifying Web3 wallet creation and management with
                human-readable names and secure recovery options.
              </p>
              {/* <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <a
                    key={social.name}
                    href={social.href}
                    className="w-10 h-10 bg-card/30 hover:bg-card/50 border border-border/30 hover:border-gold/30 rounded-lg flex items-center justify-center transition-all duration-300 hover:shadow-glow"
                  >
                    <social.icon className="w-5 h-5 text-muted-foreground hover:text-gold" />
                  </a>
                ))}
              </div> */}
            </div>

            {/* Links Sections */}
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h3 className="text-lg font-semibold text-foreground mb-6">
                  {category}
                </h3>
                <ul className="space-y-4">
                  {links.map((link) => (
                    <li key={link.name}>
                      <a
                        href={
                          link.isModal || link.isComingSoon ? "#" : link.href
                        }
                        onClick={(e) => {
                          if (link.isModal || link.isComingSoon) {
                            e.preventDefault();
                            handleLinkClick(link);
                          }
                        }}
                        className="text-muted-foreground hover:text-gold transition-colors duration-200 cursor-pointer"
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
        <div className="border-t border-border/30 py-8 ">
          <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 w-[78vw] max-w-[1140px]">
              <div className="text-muted-foreground text-sm">
                © 2025 W-Access. Built for W-Chain. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 text-sm">
                <button
                  onClick={() => navigate('/privacy-policy')}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  Privacy Policy
                </button>
                <button
                  onClick={() => navigate('/terms-of-service')}
                  className="text-muted-foreground hover:text-gold transition-colors"
                >
                  Terms of Service
                </button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="flex items-center space-x-2 text-muted-foreground text-sm">
                <span>Built with ❤️ on</span>
                <span><a
                  href="https://w-chain.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-accent font-medium hover:text-blue-accent/80 transition-colors"
                >
                  W-Chain
                </a>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onOpenChange={setIsContactModalOpen}
      />
    </footer>
  );
};

export default Footer;
