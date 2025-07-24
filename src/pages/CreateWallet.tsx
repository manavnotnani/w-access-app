import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, Shield, Key, CheckCircle, ArrowRight, Copy, Eye, EyeOff } from "lucide-react";

const CreateWallet = () => {
  const [step, setStep] = useState(1);
  const [walletName, setWalletName] = useState("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [confirmedWords, setConfirmedWords] = useState<number[]>([]);

  const seedPhrase = [
    "abandon", "ability", "able", "about", "above", "absent",
    "absorb", "abstract", "absurd", "abuse", "access", "accident"
  ];

  const verificationWords = [3, 7, 11]; // indices to verify

  const steps = [
    { id: 1, title: "Choose Name", description: "Pick a human-readable name" },
    { id: 2, title: "Generate Keys", description: "Create secure wallet keys" },
    { id: 3, title: "Backup Phrase", description: "Save your recovery phrase" },
    { id: 4, title: "Verify Backup", description: "Confirm your backup" },
    { id: 5, title: "Complete", description: "Wallet ready to use" }
  ];

  const currentStep = steps.find(s => s.id === step);
  const progress = (step / steps.length) * 100;

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Choose Your Wallet Name</h2>
              <p className="text-muted-foreground">Pick a memorable, human-readable name for your wallet</p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="wallet-name">Wallet Name</Label>
                <div className="flex mt-1">
                  <Input
                    id="wallet-name"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    placeholder="alice"
                    className="rounded-r-none"
                  />
                  <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                    .w-chain
                  </div>
                </div>
              </div>

              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your wallet name will be your public address. Choose something you'll remember!
                </AlertDescription>
              </Alert>

              <div className="flex gap-2">
                <Badge variant="outline">Available</Badge>
                <Badge variant="outline">Easy to remember</Badge>
                <Badge variant="outline">Unique</Badge>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Key className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Generating Secure Keys</h2>
              <p className="text-muted-foreground">Creating your wallet with advanced security features</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span>Entropy Generation</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span>Key Derivation</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <span>Security Validation</span>
                <CheckCircle className="w-5 h-5 text-green-400" />
              </div>
            </div>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your keys are generated locally and never leave your device. W-Access uses advanced cryptography for maximum security.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Backup Your Recovery Phrase</h2>
              <p className="text-muted-foreground">Write down these 12 words in order. You'll need them to recover your wallet.</p>
            </div>

            <Card className="border-primary/20 bg-gradient-subtle">
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Your Recovery Phrase</CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowSeedPhrase(!showSeedPhrase)}
                >
                  {showSeedPhrase ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-3">
                  {seedPhrase.map((word, index) => (
                    <div
                      key={index}
                      className="p-3 bg-background rounded-lg border text-center"
                    >
                      <span className="text-xs text-muted-foreground">{index + 1}</span>
                      <div className="font-mono font-medium">
                        {showSeedPhrase ? word : "••••"}
                      </div>
                    </div>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy to Clipboard
                </Button>
              </CardContent>
            </Card>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Store this phrase safely offline. Anyone with this phrase can access your wallet.
              </AlertDescription>
            </Alert>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Verify Your Backup</h2>
              <p className="text-muted-foreground">Select the correct words to verify your backup</p>
            </div>

            <div className="space-y-4">
              {verificationWords.map((wordIndex) => (
                <div key={wordIndex} className="space-y-2">
                  <Label>Word #{wordIndex + 1}</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {["abandon", "zebra", seedPhrase[wordIndex]].map((option, i) => (
                      <Button
                        key={i}
                        variant={confirmedWords.includes(wordIndex) && option === seedPhrase[wordIndex] ? "default" : "outline"}
                        onClick={() => {
                          if (option === seedPhrase[wordIndex]) {
                            setConfirmedWords([...confirmedWords, wordIndex]);
                          }
                        }}
                        className="h-auto p-3"
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold">Wallet Created Successfully!</h2>
              <p className="text-muted-foreground">Your W-Access wallet is ready to use</p>
            </div>

            <Card className="border-primary/20 bg-gradient-subtle">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-lg font-semibold text-primary">{walletName}.w-chain</div>
                    <div className="text-sm text-muted-foreground">0x1234...5678</div>
                  </div>
                  <div className="flex justify-center gap-2">
                    <Badge variant="secondary">✓ Secure</Badge>
                    <Badge variant="secondary">✓ Backed Up</Badge>
                    <Badge variant="secondary">✓ Ready</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Alert>
              <Shield className="h-4 w-4" />
              <AlertDescription>
                Your wallet has been created with military-grade security. Start using W-Access now!
              </AlertDescription>
            </Alert>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Create Wallet
            </h1>
            <Badge variant="outline">{step} of {steps.length}</Badge>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="flex justify-between mt-2">
            {steps.map((s) => (
              <div key={s.id} className={`text-xs ${step >= s.id ? 'text-primary' : 'text-muted-foreground'}`}>
                {s.title}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>{currentStep?.title}</CardTitle>
            <CardDescription>{currentStep?.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {renderStepContent()}
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between mt-6">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            Previous
          </Button>
          <Button
            onClick={() => {
              if (step === 5) {
                // Navigate to dashboard
              } else {
                setStep(Math.min(5, step + 1));
              }
            }}
            disabled={step === 1 && !walletName}
            className="bg-gradient-primary hover:opacity-90"
          >
            {step === 5 ? 'Go to Dashboard' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWallet;