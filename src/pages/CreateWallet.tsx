import { useState, useEffect } from "react";
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
import { WalletKeys, CryptoService } from "@/lib/crypto";
import { deploySmartContractWallet, estimateWalletCreationGas, GasEstimate } from "@/lib/utils";
import { FundingService } from "@/lib/funding";


const CreateWallet = () => {
  const [step, setStep] = useState(1);
  const [walletName, setWalletName] = useState("");
  const [showSeedPhrase, setShowSeedPhrase] = useState(false);
  const [confirmedWords, setConfirmedWords] = useState<number[]>([]);
  const [verificationWords, setVerificationWords] = useState<number[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [walletKeys, setWalletKeys] = useState<WalletKeys | null>(null);
  const [keyGenerationError, setKeyGenerationError] = useState<string | null>(null);
  const [gasEstimate, setGasEstimate] = useState<GasEstimate | null>(null);
  const [isEstimatingGas, setIsEstimatingGas] = useState(false);
  const [isFunding, setIsFunding] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Use generated seed phrase instead of hardcoded one
  const seedPhrase = walletKeys?.seedPhrase || [];

  // Generate random word positions for verification (3 random positions from 12 words)
  const generateRandomVerificationWords = () => {
    const allIndices = Array.from({ length: 12 }, (_, i) => i);
    const shuffled = allIndices.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3).sort((a, b) => a - b); // Sort to maintain order
  };

  // Generate random verification words when seed phrase is available
  useEffect(() => {
    if (seedPhrase.length === 12 && verificationWords.length === 0) {
      setVerificationWords(generateRandomVerificationWords());
    }
  }, [seedPhrase]);

  // Reset verification words when entering verification step (step 4)
  useEffect(() => {
    if (step === 4 && seedPhrase.length === 12) {
      setVerificationWords(generateRandomVerificationWords());
      setConfirmedWords([]); // Also reset confirmed words
    }
  }, [step, seedPhrase]);

  // Estimate gas when we reach step 5 if not already estimated
  useEffect(() => {
    if (step === 5 && walletKeys && walletName && !gasEstimate && !isEstimatingGas) {
      console.log('CreateWallet - Step 5 reached, estimating gas...');
      const estimateGas = async () => {
        try {
          setIsEstimatingGas(true);
          const gasEstimate = await estimateWalletCreationGas(walletName, walletKeys.privateKey);
          setGasEstimate(gasEstimate);
          setIsEstimatingGas(false);
          console.log('CreateWallet - Gas estimation complete in useEffect:', gasEstimate);
        } catch (error) {
          console.error('Error estimating gas in useEffect:', error);
          setIsEstimatingGas(false);
        }
      };
      estimateGas();
    }
  }, [step, walletKeys, walletName, gasEstimate, isEstimatingGas]);

  const steps = [
    { id: 1, title: "Choose Name", description: "Pick a human-readable name" },
    { id: 2, title: "Generate Keys", description: "Create secure wallet keys" },
    { id: 3, title: "Backup Phrase", description: "Save your recovery phrase" },
    { id: 4, title: "Verify Backup", description: "Confirm your backup" },
    { id: 5, title: "Complete", description: "Wallet ready to use" }
  ];

  const currentStep = steps.find(s => s.id === step);
  const progress = (step / steps.length) * 100;

  const handleKeysGenerated = async (keys: WalletKeys) => {
    console.log('CreateWallet - handleKeysGenerated called with keys:', keys);
    setWalletKeys(keys);
    setKeyGenerationError(null);
    
    console.log('CreateWallet - handleKeysGenerated:', {
      walletName,
      hasWalletName: !!walletName,
      keysGenerated: !!keys
    });
    
    // Estimate gas as soon as keys are generated
    if (walletName) {
      try {
        setIsEstimatingGas(true);
        console.log('CreateWallet - Starting gas estimation...');
        const gasEstimate = await estimateWalletCreationGas(walletName, keys.privateKey);
        console.log('CreateWallet - Gas estimation complete:', gasEstimate);
        setGasEstimate(gasEstimate);
        setIsEstimatingGas(false);
      } catch (error) {
        console.error('Error estimating gas:', error);
        setIsEstimatingGas(false);
        // Don't throw error here, just log it - gas estimation will happen again during deployment
      }
    } else {
      console.log('CreateWallet - No wallet name, skipping gas estimation');
    }
  };

  const handleKeyGenerationError = (error: string) => {
    setKeyGenerationError(error);
  };

  // Re-estimate gas when wallet name changes (if keys are already generated)
  const handleWalletNameChange = async (name: string) => {
    setWalletName(name);
    
    console.log('CreateWallet - handleWalletNameChange:', {
      name,
      hasWalletKeys: !!walletKeys,
      nameLength: name.length
    });
    
    // Re-estimate gas if keys are already generated
    if (walletKeys && name.length >= 3) {
      try {
        setIsEstimatingGas(true);
        console.log('CreateWallet - Re-estimating gas for new name...');
        const gasEstimate = await estimateWalletCreationGas(name, walletKeys.privateKey);
        console.log('CreateWallet - Re-estimation complete:', gasEstimate);
        setGasEstimate(gasEstimate);
        setIsEstimatingGas(false);
      } catch (error) {
        console.error('Error re-estimating gas:', error);
        setIsEstimatingGas(false);
      }
    }
  };

  const handleContinue = async () => {
    if (step === 5) {
      // Save wallet to database
      setIsSaving(true);
      try {
        if (!walletKeys) {
          throw new Error("Wallet keys not generated");
        }

        // Step 1: Use existing gas estimate or estimate if not available
        let currentGasEstimate = gasEstimate;
        if (!currentGasEstimate) {
          console.log('CreateWallet - No gas estimate found, estimating now...');
          setIsEstimatingGas(true);
          currentGasEstimate = await estimateWalletCreationGas(walletName, walletKeys.privateKey);
          setGasEstimate(currentGasEstimate);
          setIsEstimatingGas(false);
          console.log('CreateWallet - Gas estimation complete:', currentGasEstimate);
        } else {
          console.log('CreateWallet - Using existing gas estimate:', currentGasEstimate);
        }

        toast({
          title: "Gas Estimation Complete",
          description: `Estimated gas cost: ${currentGasEstimate.gasCostInWCO} WCO`,
        });

        // Step 2: Fund the wallet with the exact gas amount needed (if not already funded)
        setIsFunding(true);
        const fundingResult = await FundingService.fundWalletForGas(walletKeys.address, currentGasEstimate.gasCostInWCO);
        
        if (!fundingResult.success) {
          throw new Error(`Failed to fund wallet: ${fundingResult.error}`);
        }

        // Show appropriate message based on funding result
        if (fundingResult.transactionHash === "already_funded") {
          toast({
            title: "Wallet Already Funded",
            description: `Wallet already has sufficient funds (${(parseFloat(currentGasEstimate.gasCostInWCO) * 1.1).toFixed(6)} WCO) for gas fees`,
          });
        } else {
          toast({
            title: "Wallet Funded",
            description: `Wallet funded with ${(parseFloat(currentGasEstimate.gasCostInWCO) * 1.1).toFixed(6)} WCO for gas fees`,
          });
        }

        setIsFunding(false);

        // Step 3: Deploy the smart contract wallet
        const contractAddress = await deploySmartContractWallet(walletName, walletKeys.privateKey);
        
        // Validate the deployed contract address
        if (!CryptoService.isValidAddress(contractAddress)) {
          throw new Error("Invalid contract address deployed");
        }
        
        // Check if address already exists (very unlikely but good practice)
        const addressExists = await walletService.checkAddressExists(contractAddress);
        if (addressExists) {
          throw new Error("Wallet address already exists. Please try again.");
        }
        
        // Hash the mnemonic for secure storage
        const seedPhraseHash = CryptoService.hashData(walletKeys.mnemonic);
        
        const walletData = {
          name: walletName,
          address: contractAddress,
          seed_phrase_hash: seedPhraseHash
          // user_id will be auto-generated by the database
        };

        const savedWallet = await walletService.createWallet(walletData);
        
        if (savedWallet) {
          toast({
            title: "Wallet Created Successfully!",
            description: `Wallet "${walletName}.w-chain" (${contractAddress.slice(0, 8)}...${contractAddress.slice(-6)}) has been created and deployed to the blockchain.`,
          });
          navigate("/security-setup");
        } else {
          throw new Error("Failed to save wallet to database");
        }
      } catch (error) {
        console.error("Error saving wallet:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to create wallet";
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
      } finally {
        setIsSaving(false);
        setIsEstimatingGas(false);
        setIsFunding(false);
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
            setWalletName={handleWalletNameChange} 
          />
        );
      case 2:
        return (
          <KeyGenerationStep 
            onKeysGenerated={handleKeysGenerated}
            onError={handleKeyGenerationError}
          />
        );
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
        console.log('CreateWallet - Rendering CompleteStep with:', {
          walletName,
          walletAddress: walletKeys?.address,
          gasEstimate,
          isEstimatingGas
        });
        return <CompleteStep walletName={walletName} walletAddress={walletKeys?.address} gasEstimate={gasEstimate} isEstimatingGas={isEstimatingGas} />;
      default:
        return null;
    }
  };

  // Check if we can proceed to next step
  const canContinue = () => {
    switch (step) {
      case 1:
        return walletName && walletName.length >= 3;
      case 2:
        return walletKeys !== null && keyGenerationError === null;
      case 3:
        return showSeedPhrase;
      case 4:
        return confirmedWords.length === verificationWords.length;
      case 5:
        return true;
      default:
        return false;
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
            disabled={!canContinue() || isSaving || isEstimatingGas || isFunding}
            className="bg-gradient-primary hover:opacity-90"
          >
            {isSaving ? (
              isEstimatingGas ? 'Estimating Gas...' : 
              isFunding ? 'Funding Wallet...' : 
              'Creating Wallet...'
            ) : step === 5 ? 'Create Wallet' : 'Continue'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateWallet;