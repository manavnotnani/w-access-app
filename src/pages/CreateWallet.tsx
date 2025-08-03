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
import { walletService } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

const CreateWallet = () => {
  const [step, setStep] = useState(1);
  const [walletName, setWalletName] = useState("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [confirmedWords, setConfirmedWords] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

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

  const handleContinue = async () => {
    if (step === 5) {
      // Save wallet to database
      setIsSaving(true);
      try {
        // Generate a mock user ID (in real app, this would come from auth)
        const userId = crypto.randomUUID();
        
        // Generate a mock wallet address (in real app, this would be generated from seed phrase)
        const walletAddress = `0x${crypto.randomUUID().replace(/-/g, '').substring(0, 40)}`;
        
        // Hash the seed phrase (in real app, use proper encryption)
        const seedPhraseHash = btoa(seedPhrase.join(' '));
        
        const walletData = {
          user_id: userId,
          name: walletName,
          address: walletAddress,
          seed_phrase_hash: seedPhraseHash
        };

        const savedWallet = await walletService.createWallet(walletData);
        
        if (savedWallet) {
          toast({
            title: "Wallet Created!",
            description: `Wallet "${walletName}.w-chain" has been successfully created.`,
          });
          navigate("/security-setup");
        } else {
          throw new Error("Failed to save wallet");
        }
      } catch (error) {
        console.error("Error saving wallet:", error);
        toast({
          title: "Error",
          description: "Failed to create wallet. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
      }
    } else {
      setStep(Math.min(5, step + 1));
    }
  };

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
            onClick={handleContinue}
            disabled={
              (step === 1 && (!walletName || walletName.length < 3)) ||
              (step === 4 && confirmedWords.length !== verificationWords.length) ||
              isSaving
            }
            className="bg-gradient-primary hover:opacity-90"
          >
            {isSaving ? 'Creating Wallet...' : step === 5 ? 'Create Wallet' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWallet;