import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { WalletNameStep } from "@/components/wallet/WalletNameStep";
import { KeyGenerationStep } from "@/components/wallet/KeyGenerationStep";
import { SeedPhraseStep } from "@/components/wallet/SeedPhraseStep";
import { VerificationStep } from "@/components/wallet/VerificationStep";
import { CompleteStep } from "@/components/wallet/CompleteStep";

const CreateWallet = () => {
  const [step, setStep] = useState(1);
  const [walletName, setWalletName] = useState("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [confirmedWords, setConfirmedWords] = useState<number[]>([]);
  const navigate = useNavigate();

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
          <WalletNameStep 
            walletName={walletName} 
            setWalletName={setWalletName} 
          />
        );
      case 2:
        return <KeyGenerationStep />;
      case 3:
        return (
          <SeedPhraseStep
            seedPhrase={seedPhrase}
            showSeedPhrase={showSeedPhrase}
            setShowSeedPhrase={setShowSeedPhrase}
          />
        );
      case 4:
        return (
          <VerificationStep
            seedPhrase={seedPhrase}
            verificationWords={verificationWords}
            confirmedWords={confirmedWords}
            setConfirmedWords={setConfirmedWords}
          />
        );
      case 5:
        return <CompleteStep walletName={walletName} />;
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
                navigate("/security-setup");
              } else {
                setStep(Math.min(5, step + 1));
              }
            }}
            disabled={step === 1 && (!walletName || walletName.length < 3)}
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