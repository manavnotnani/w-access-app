import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const TermsOfService = () => {
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
          <h1 className="text-4xl font-bold text-foreground mb-8">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">
            Last updated: September 2025
          </p>

          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By accessing and using W-Access ("the Service"), you accept and agree to be bound by the 
                terms and provision of this agreement. If you do not agree to abide by the above, please 
                do not use this service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                W-Access is a Web3 wallet creation and management platform that provides:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>Secure wallet creation and management</li>
                <li>Human-readable wallet names through WNS (W-Access Name Service)</li>
                <li>Advanced recovery mechanisms</li>
                <li>Cross-chain compatibility</li>
                <li>Integration with W-Chain blockchain</li>
                <li>Educational resources and tutorials</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">3. User Responsibilities</h2>
              <h3 className="text-xl font-medium text-foreground mb-3">3.1 Account Security</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You are responsible for:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>Maintaining the confidentiality of your wallet credentials</li>
                <li>Securing your private keys and seed phrases</li>
                <li>Implementing appropriate security measures</li>
                <li>Reporting any unauthorized access immediately</li>
              </ul>

              <h3 className="text-xl font-medium text-foreground mb-3">3.2 Prohibited Activities</h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree not to:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>Use the service for illegal activities</li>
                <li>Attempt to hack or compromise the platform</li>
                <li>Create multiple accounts to circumvent restrictions</li>
                <li>Interfere with other users' access to the service</li>
                <li>Violate any applicable laws or regulations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">4. Blockchain and Cryptocurrency Risks</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                By using our service, you acknowledge and accept the following risks:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>Cryptocurrency values are highly volatile</li>
                <li>Blockchain transactions are irreversible</li>
                <li>Smart contract risks and potential bugs</li>
                <li>Regulatory changes may affect service availability</li>
                <li>Technology risks including network congestion</li>
                <li>Loss of private keys results in permanent loss of funds</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">5. Intellectual Property</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                The service and its original content, features, and functionality are owned by W-Access 
                and are protected by international copyright, trademark, patent, trade secret, and other 
                intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">6. Privacy and Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Your privacy is important to us. Please review our Privacy Policy, which also governs 
                your use of the service, to understand our practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">7. Service Availability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We strive to maintain high service availability but cannot guarantee uninterrupted access. 
                The service may be temporarily unavailable due to:
              </p>
              <ul className="text-muted-foreground leading-relaxed mb-4 list-disc list-inside">
                <li>Scheduled maintenance and updates</li>
                <li>Technical difficulties or system failures</li>
                <li>Blockchain network issues</li>
                <li>Force majeure events</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">8. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                To the maximum extent permitted by law, W-Access shall not be liable for any indirect, 
                incidental, special, consequential, or punitive damages, including without limitation, 
                loss of profits, data, use, goodwill, or other intangible losses, resulting from your 
                use of the service.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">9. Indemnification</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You agree to defend, indemnify, and hold harmless W-Access and its officers, directors, 
                employees, and agents from and against any claims, damages, obligations, losses, liabilities, 
                costs, or debt, and expenses (including attorney's fees) arising from your use of the service 
                or violation of these terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">10. Termination</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We may terminate or suspend your access to the service immediately, without prior notice 
                or liability, for any reason whatsoever, including without limitation if you breach the terms.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">11. Governing Law</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These terms shall be interpreted and governed by the laws of the jurisdiction in which 
                W-Access operates, without regard to its conflict of law provisions.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">12. Changes to Terms</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We reserve the right, at our sole discretion, to modify or replace these terms at any time. 
                If a revision is material, we will try to provide at least 30 days notice prior to any new 
                terms taking effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">13. Contact Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If you have any questions about these Terms of Service, please contact us at:
              </p>
              <div className="bg-card/30 border border-border/30 rounded-lg p-6">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Email:</strong> manav.notnani@gmail.com<br />
                  <strong className="text-foreground">Website:</strong> https://w-access.xyz<br />
                  <strong className="text-foreground">Address:</strong> W-Access Legal Team, Web3 Innovation Hub
                </p>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">14. Severability</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                If any provision of these terms is held to be invalid or unenforceable by a court, the 
                remaining provisions of these terms will remain in effect.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-foreground mb-4">15. Entire Agreement</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                These terms constitute the sole and entire agreement between you and W-Access regarding 
                the service and supersede all prior and contemporaneous understandings, agreements, 
                representations, and warranties.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
