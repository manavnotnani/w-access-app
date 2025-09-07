import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, AlertTriangle, CheckCircle, RefreshCw, Download, Upload, Loader2 } from "lucide-react";
import { CryptoService, WalletKeys } from "@/lib/crypto";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { walletService } from "@/lib/database";
import { validateEmail } from "@/lib/utils";
import { sendOtpEmail } from "@/lib/email";

const Recovery = () => {
  const [seedPhrase, setSeedPhrase] = useState(Array(12).fill(""));
  const [recoveryMethod, setRecoveryMethod] = useState<string>("");
  const [isRecovering, setIsRecovering] = useState(false);
  const [recoveredWallet, setRecoveredWallet] = useState<WalletKeys | null>(null);
  const [recoveryError, setRecoveryError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Email recovery state
  const [email, setEmail] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [emailSentCode, setEmailSentCode] = useState<string | null>(null);
  const [emailSending, setEmailSending] = useState(false);
  const [emailRecovering, setEmailRecovering] = useState(false);

  const handleSeedPhraseChange = (index: number, value: string) => {
    const newSeedPhrase = [...seedPhrase];
    newSeedPhrase[index] = value.toLowerCase().trim();
    setSeedPhrase(newSeedPhrase);
    setRecoveryError(null); // Clear error when user types
  };

  const handleRecoverWallet = async () => {
    const mnemonic = seedPhrase.join(' ').trim();
    
    if (mnemonic.split(' ').length !== 12) {
      setRecoveryError("Please enter all 12 words");
      return;
    }

    setIsRecovering(true);
    setRecoveryError(null);

    try {
      const wallet = await CryptoService.recoverWallet(mnemonic);
      setRecoveredWallet(wallet);
      
      toast({
        title: "Wallet Recovered!",
        description: `Successfully recovered wallet: ${wallet.address.slice(0, 8)}...${wallet.address.slice(-6)}`,
      });

      // Navigate to dashboard or wallet view
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);

    } catch (error) {
      console.error('Recovery error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to recover wallet';
      setRecoveryError(errorMessage);
      
      toast({
        title: "Recovery Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsRecovering(false);
    }
  };

  const validateSeedPhrase = () => {
    const mnemonic = seedPhrase.join(' ').trim();
    if (mnemonic.split(' ').length !== 12) return false;
    
    // Check if all words are filled
    return seedPhrase.every(word => word.trim() !== '');
  };

  const sendEmailCode = async () => {
    if (!validateEmail(email)) {
      toast({ title: "Invalid email", variant: "destructive" });
      return;
    }
    setEmailSending(true);
    try {
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      setEmailSentCode(code);
      await sendOtpEmail({ to: email, code, subject: "Your recovery code" });
      toast({ title: "Verification code sent", description: "Check your email for the code." });
    } finally {
      setEmailSending(false);
    }
  };

  const verifyEmailAndRecover = async () => {
    if (!emailSentCode || emailCode.trim() !== emailSentCode) {
      toast({ title: "Invalid code", description: "Please enter valid 6-digit code.", variant: "destructive" });
      return;
    }
    setEmailRecovering(true);
    try {
      const wallets = await walletService.getWalletsByRecoveryEmail(email);
      const ok = await walletService.rebindWalletsToCurrentSession(wallets.map((w: any) => w.id));
      if (!ok) throw new Error('Failed to rebind wallets');
      toast({ title: "Wallets recovered", description: `Recovered ${wallets.length} wallet(s).` });
      navigate('/dashboard');
    } catch (e) {
      console.error(e);
      toast({ title: "Recovery failed", variant: "destructive" });
    } finally {
      setEmailRecovering(false);
    }
  };

  const backupMethods = [
    {
      id: "cloud",
      title: "Cloud Backup",
      description: "Encrypted backup stored securely in the cloud",
      status: "active",
      lastBackup: "2 hours ago"
    },
    {
      id: "social",
      title: "Social Recovery",
      description: "Recover using trusted contacts",
      status: "configured",
      guardians: 3
    },
    {
      id: "hardware",
      title: "Hardware Backup",
      description: "Physical security key backup",
      status: "not-configured",
      lastBackup: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400";
      case "configured": return "text-blue-400";
      case "not-configured": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "configured": return <Shield className="w-4 h-4 text-blue-400" />;
      case "not-configured": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Wallet Recovery
          </h1>
          <p className="text-muted-foreground">Manage your wallet backup and recovery options</p>
        </div>

        <Tabs defaultValue="backup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backup">Backup Methods</TabsTrigger>
            <TabsTrigger value="recover">Recover Wallet</TabsTrigger>
            <TabsTrigger value="security">Security Center</TabsTrigger>
          </TabsList>

          <TabsContent value="backup" className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Multiple Backup Options</AlertTitle>
              <AlertDescription>
                W-Access provides multiple ways to backup and recover your wallet. Enable multiple methods for maximum security.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6">
              {backupMethods.map((method) => (
                <Card key={method.id} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(method.status)}
                        <div>
                          <CardTitle className="text-lg">{method.title}</CardTitle>
                          <CardDescription>{method.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={method.status === "active" ? "default" : "outline"}>
                        {method.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {method.lastBackup && `Last backup: ${method.lastBackup}`}
                        {method.guardians && `${method.guardians} guardians configured`}
                        {method.status === "not-configured" && "Not configured"}
                      </div>
                      <div className="flex gap-2">
                        {method.status === "active" && (
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Backup Now
                          </Button>
                        )}
                        <Button 
                          variant={method.status === "not-configured" ? "default" : "outline"} 
                          size="sm"
                          className={method.status === "not-configured" ? "bg-gradient-primary hover:opacity-90" : ""}
                        >
                          {method.status === "not-configured" ? "Setup" : "Configure"}
                        </Button>
                      </div>
                    </div>

                    {method.id === "cloud" && method.status === "active" && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Your wallet is automatically backed up to encrypted cloud storage
                        </div>
                      </div>
                    )}

                    {method.id === "social" && method.status === "configured" && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-blue-400 text-sm">
                          Recovery requires approval from 2 of 3 guardians
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recover" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Wallet Recovery</AlertTitle>
              <AlertDescription>
                Enter your recovery phrase or use alternative recovery methods to restore your wallet.
              </AlertDescription>
            </Alert>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Recovery Methods</CardTitle>
                <CardDescription>Choose how you want to recover your wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button
                    variant={recoveryMethod === "seed" ? "default" : "outline"}
                    onClick={() => setRecoveryMethod("seed")}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Key className="w-6 h-6" />
                    <span>Seed Phrase</span>
                  </Button>
                  <Button
                    variant={recoveryMethod === "cloud" ? "default" : "outline"}
                    onClick={() => setRecoveryMethod("cloud")}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Download className="w-6 h-6" />
                    <span>Cloud Backup</span>
                  </Button>
                  <Button
                    variant={recoveryMethod === "social" ? "default" : "outline"}
                    onClick={() => setRecoveryMethod("social")}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Shield className="w-6 h-6" />
                    <span>Social Recovery</span>
                  </Button>
                  <Button
                    variant={recoveryMethod === "email" ? "default" : "outline"}
                    onClick={() => setRecoveryMethod("email")}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Shield className="w-6 h-6" />
                    <span>Email</span>
                  </Button>
                </div>

                {recoveryMethod === "seed" && (
                  <div className="space-y-4">
                    <Label>Enter your 12-word recovery phrase</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {seedPhrase.map((word, index) => (
                        <div key={index} className="space-y-1">
                          <Label className="text-xs text-muted-foreground">{index + 1}</Label>
                          <Input
                            value={word}
                            onChange={(e) => handleSeedPhraseChange(index, e.target.value)}
                            placeholder="word"
                            className="text-center font-mono"
                            disabled={isRecovering}
                          />
                        </div>
                      ))}
                    </div>
                    
                    {recoveryError && (
                      <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{recoveryError}</AlertDescription>
                      </Alert>
                    )}

                    {recoveredWallet && (
                      <Alert className="border-green-200 bg-green-50">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription className="text-green-800">
                          <strong>Wallet recovered successfully!</strong><br />
                          Address: {recoveredWallet.address}<br />
                          Redirecting to dashboard...
                        </AlertDescription>
                      </Alert>
                    )}

                    <Button 
                      className="w-full bg-gradient-primary hover:opacity-90"
                      onClick={handleRecoverWallet}
                      disabled={!validateSeedPhrase() || isRecovering}
                    >
                      {isRecovering ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Recovering Wallet...
                        </>
                      ) : (
                        'Recover Wallet'
                      )}
                    </Button>
                  </div>
                )}

                {recoveryMethod === "cloud" && (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                      <Download className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Cloud Recovery</h3>
                    <p className="text-muted-foreground">
                      We'll help you recover your wallet from your encrypted cloud backup.
                    </p>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Start Cloud Recovery
                    </Button>
                  </div>
                )}

                {recoveryMethod === "email" && (
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="recover-email">Your verified recovery email</Label>
                      <div className="flex gap-2 mt-1">
                        <Input
                          id="recover-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="you@example.com"
                        />
                        <Button onClick={sendEmailCode} disabled={!validateEmail(email) || emailSending}>
                          {emailSending ? 'Sending…' : 'Send Code'}
                        </Button>
                      </div>
                    </div>
                    {emailSentCode && (
                      <div>
                        <Label htmlFor="recover-code">Enter 6-digit code</Label>
                        <div className="flex gap-2 mt-1">
                          <Input
                            id="recover-code"
                            type="text"
                            inputMode="numeric"
                            maxLength={6}
                            value={emailCode}
                            onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                            placeholder="123456"
                          />
                          <Button variant="outline" onClick={verifyEmailAndRecover} disabled={emailRecovering}>
                            {emailRecovering ? 'Recovering…' : 'Verify & Recover'}
                          </Button>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">For demo, the code is logged to console.</p>
                      </div>
                    )}
                  </div>
                )}

                {recoveryMethod === "social" && (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Social Recovery</h3>
                    <p className="text-muted-foreground">
                      Contact your trusted guardians to initiate wallet recovery.
                    </p>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Request Guardian Approval
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Security Score</CardTitle>
                <CardDescription>Your wallet security rating and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">98%</div>
                  <p className="text-muted-foreground">Excellent Security</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Seed phrase backed up</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      ✓ Complete
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Cloud backup enabled</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      ✓ Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-500/10 border-yellow-500/20">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span>Hardware backup</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Consider enabling hardware backup for maximum security. This adds an extra layer of protection for your wallet.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Recovery;