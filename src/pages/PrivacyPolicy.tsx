import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-dark-surface">
      {/* Header */}
      <div className="border-b border-border/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-muted-foreground hover:text-gold transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="flex items-center space-x-3">
              <img 
                src="/lovable-uploads/f03e8d40-ba1a-4f1e-a6c0-d0a28269e251.png" 
                alt="W-Access" 
                className="w-8 h-8"
              />
              <span className="text-xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                W-ACCESS
              </span>
            </div>
            <div className="w-20"></div> {/* Spacer for balance */}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-6 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-foreground mb-8">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: September 2025
          </p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                W-Access ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy 
                explains how we collect, use, disclose, and safeguard your information when you use our 
                Web3 wallet creation and management platform.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-medium text-foreground mb-3">2.1 Personal Information</h3>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>Email addresses for account creation and communication</li>
                <li>Wallet names and identifiers you choose</li>
                <li>Recovery information and security preferences</li>
                <li>Transaction history and wallet activity</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">2.2 Technical Information</h3>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>IP addresses and device information</li>
                <li>Browser type and version</li>
                <li>Usage patterns and platform interactions</li>
                <li>Blockchain transaction data</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use the collected information to:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>Provide and maintain our wallet services</li>
                <li>Process transactions and manage your accounts</li>
                <li>Implement security measures and fraud prevention</li>
                <li>Communicate with you about service updates</li>
                <li>Improve our platform and user experience</li>
                <li>Comply with legal and regulatory requirements</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Information Sharing and Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We do not sell, trade, or rent your personal information to third parties. We may share 
                your information only in the following circumstances:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and prevent fraud</li>
                <li>With trusted service providers who assist in our operations</li>
                <li>In connection with a business transfer or merger</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Data Security</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We implement industry-standard security measures to protect your information:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>End-to-end encryption for sensitive data</li>
                <li>Secure key generation and storage</li>
                <li>Regular security audits and updates</li>
                <li>Access controls and authentication protocols</li>
                <li>Blockchain-based security features</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Your Rights and Choices</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You have the right to:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>Access and update your personal information</li>
                <li>Delete your account and associated data</li>
                <li>Opt-out of marketing communications</li>
                <li>Export your wallet data</li>
                <li>Request information about data processing</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Blockchain and Decentralization</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                As a Web3 platform, certain information may be stored on public blockchains. 
                This includes:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>Wallet addresses and transaction records</li>
                <li>Smart contract interactions</li>
                <li>Public key information</li>
                <li>Blockchain-based identity data</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Please note that blockchain data is immutable and publicly accessible.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our platform may integrate with third-party services including:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>Blockchain networks and nodes</li>
                <li>Email service providers</li>
                <li>Analytics and monitoring tools</li>
                <li>Security and authentication services</li>
              </ul>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These services have their own privacy policies, which we encourage you to review.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. International Data Transfers</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your information may be transferred to and processed in countries other than your own. 
                We ensure appropriate safeguards are in place to protect your data during such transfers.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Children's Privacy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Our services are not intended for children under 13 years of age. We do not knowingly 
                collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Changes to This Policy</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes 
                by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about this Privacy Policy, please contact us at:
              </p>
              <div className="bg-card/30 border border-border/30 rounded-lg p-6">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Email:</strong> manav.notnani@gmail.com<br />
                  <strong className="text-foreground">Website:</strong> https://w-access.xyz<br />
                  <strong className="text-foreground">Address:</strong> W-Access Privacy Team, Web3 Innovation Hub
                </p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
