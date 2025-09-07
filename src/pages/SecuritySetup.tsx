import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Switch } from "@/components/ui/switch";
import { Shield, Key, Smartphone, Mail, CheckCircle, ArrowRight, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { validateEmail } from "@/lib/utils";
import { walletService, recoveryService, settingsService } from "@/lib/database";
import { sendOtpEmail } from "@/lib/email";
import { useToast } from "@/hooks/use-toast";

const SecuritySetup = () => {
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const isEmailValid = validateEmail(recoveryEmail);
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [methodId, setMethodId] = useState<string | null>(null);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const { toast } = useToast();

  const getCurrentWalletId = async (): Promise<string | null> => {
    const wallets = await walletService.getWalletsBySession();
    if (!wallets || wallets.length === 0) return null;
    // Use most recently created wallet in this session
    return wallets[0].id;
  };

  const handleSendCode = async () => {
    if (!isEmailValid) return;
    setIsSendingCode(true);
    try {
      const walletId = await getCurrentWalletId();
      if (!walletId) {
        toast({ title: "No wallet found", description: "Create a wallet first.", variant: "destructive" });
        return;
      }

      // Create recovery method record (unverified)
      const method = await recoveryService.addRecoveryMethod({
        wallet_id: walletId,
        type: 'email',
        value: recoveryEmail,
        is_verified: false
      } as any);

      if (!method) {
        toast({ title: "Error", description: "Failed to create recovery record.", variant: "destructive" });
        return;
      }
      setMethodId(method.id);

      // Generate a 6-digit code and send via email
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setSentCode(code);
      await sendOtpEmail({ to: recoveryEmail, code, subject: "Your verification code" });
      toast({ title: "Verification code sent", description: "Check your email for the code." });
    } catch (e) {
      console.error(e);
      toast({ title: "Error", description: "Could not send verification code.", variant: "destructive" });
    } finally {
      setIsSendingCode(false);
    }
  };

  const handleVerifyCode = async () => {
    if (!methodId || !sentCode) return;
    if (verificationCode.trim() !== sentCode) {
      toast({ title: "Invalid code", description: "Please enter valid 6-digit code.", variant: "destructive" });
      return;
    }
    const ok = await recoveryService.verifyRecoveryMethod(methodId);
    if (ok) {
      setIsEmailVerified(true);
      toast({ title: "Email verified", description: "Recovery email added." });
    } else {
      toast({ title: "Error", description: "Failed to verify email.", variant: "destructive" });
    }
  };
  const navigate = useNavigate();

  const securityFeatures = [
    {
      id: "recovery",
      title: "Recovery Email",
      description: "Add an email for account recovery assistance",
      icon: Mail,
      status: isEmailVerified ? "complete" : "pending",
      required: true
    },
    {
      id: "2fa",
      title: "Two-Factor Authentication",
      description: "Extra security layer using your phone",
      icon: Smartphone,
      status: "coming-soon",
      required: false
    },
    {
      id: "biometric",
      title: "Biometric Lock",
      description: "Use fingerprint or face ID to access wallet",
      icon: Key,
      status: "coming-soon",
      required: false
    }
  ];

  const handleComplete = async () => {
    try {
      const walletId = await getCurrentWalletId();
      if (walletId) {
        // Persist settings
        await settingsService.upsertWalletSettings({
          wallet_id: walletId,
          theme: 'system',
          notifications_enabled: true,
          security_level: isEmailVerified ? 'basic' : 'minimal'
        } as any);
      }
    } catch (e) {
      console.error('Failed saving settings', e);
    } finally {
      setSetupComplete(true);
      setTimeout(() => {
        navigate("/wallet-tutorial");
      }, 2000);
    }
  };

  if (setupComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md mx-auto border-primary/20">
          <CardContent className="pt-6 text-center">
            <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Security Setup Complete!</h2>
            <p className="text-muted-foreground mb-4">Your wallet is now protected with enhanced security features.</p>
            <div className="flex justify-center gap-2 mb-4">
              <Badge variant="secondary">✓ Secure</Badge>
              <Badge variant="secondary">✓ Protected</Badge>
              <Badge variant="secondary">✓ Ready</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Redirecting to tutorial...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Secure Your Wallet
          </h1>
          <p className="text-muted-foreground">
            Set up additional security features to protect your W-Access wallet
          </p>
        </div>

        {/* Security Features */}
        <div className="space-y-6 mb-8">
          {/* Recovery Email */}
          <Card className="border-primary/20">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Recovery Email</CardTitle>
                    <CardDescription>Add an email for account recovery assistance</CardDescription>
                  </div>
                </div>
                <Badge variant={isEmailVerified ? "default" : "outline"}>
                  {isEmailVerified ? "Verified" : "Required"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="recovery-email">Email Address</Label>
                  <Input
                    id="recovery-email"
                    type="email"
                    value={recoveryEmail}
                    onChange={(e) => setRecoveryEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                  {!isEmailValid && recoveryEmail && (
                    <p className="mt-2 text-sm text-red-500">Enter a valid email address.</p>
                  )}
                  <div className="mt-3 flex gap-2">
                    <Button size="sm" onClick={handleSendCode} disabled={!isEmailValid || isSendingCode || isEmailVerified}>
                      {isSendingCode ? 'Sending…' : (isEmailVerified ? 'Verified' : 'Send Code')}
                    </Button>
                  </div>
                </div>
                {sentCode && !isEmailVerified && (
                  <div>
                    <Label htmlFor="verification-code">Enter 6-digit Code</Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        id="verification-code"
                        type="text"
                        inputMode="numeric"
                        maxLength={6}
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                        placeholder="123456"
                      />
                      <Button variant="outline" onClick={handleVerifyCode}>Verify</Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">For demo, the code is logged to console.</p>
                  </div>
                )}
                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    This email will only be used for account recovery. We'll never spam you.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>

          {/* Two-Factor Authentication */}
          <Card className="border-primary/20 opacity-75">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Two-Factor Authentication</CardTitle>
                    <CardDescription>Extra security layer using your phone</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Implementing Soon
                  </Badge>
                  <Switch
                    checked={false}
                    disabled={true}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert>
                <Smartphone className="h-4 w-4" />
                <AlertDescription>
                  This feature is currently under development and will be available in a future update.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Biometric Lock */}
          <Card className="border-primary/20 opacity-75">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Key className="w-5 h-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">Biometric Lock</CardTitle>
                    <CardDescription>Use fingerprint or face ID to access wallet</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    Implementing Soon
                  </Badge>
                  <Switch
                    checked={false}
                    disabled={true}
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Alert>
                <Lock className="h-4 w-4" />
                <AlertDescription>
                  This feature is currently under development and will be available in a future update.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4">
          <Button
            onClick={handleComplete}
            disabled={!isEmailVerified}
            className="w-full bg-gradient-primary hover:opacity-90"
            size="lg"
          >
            Complete Security Setup
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/wallet-tutorial")}
            className="w-full"
          >
            Skip for Now
          </Button>
        </div>

        {/* Security Summary */}
        <div className="mt-8 p-4 bg-gradient-subtle rounded-lg border border-primary/20">
          <h3 className="font-semibold mb-2">Security Level</h3>
          <div className="flex gap-2 mb-2 flex-wrap">
            {securityFeatures.map((feature) => (
              <Badge
                key={feature.id}
                variant={
                  feature.status === "complete" 
                    ? "default" 
                    : feature.status === "coming-soon" 
                    ? "secondary" 
                    : "outline"
                }
                className="text-xs"
              >
                {feature.status === "coming-soon" ? `${feature.title} (Soon)` : feature.title}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            {securityFeatures.filter(f => f.status === "complete").length} of {securityFeatures.filter(f => f.status !== "coming-soon").length} available security features enabled
          </p>
        </div>
      </div>
    </div>
  );
};

export default SecuritySetup;