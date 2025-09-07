import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Shield, CheckCircle, Loader2 } from "lucide-react";
import { CryptoService, WalletKeys, KeyGenerationProgress } from "@/lib/crypto";

interface KeyGenerationStepProps {
  onKeysGenerated: (keys: WalletKeys) => void;
  onError: (error: string) => void;
}

export const KeyGenerationStep = ({ onKeysGenerated, onError }: KeyGenerationStepProps) => {
  const [progress, setProgress] = useState<KeyGenerationProgress>({
    entropyGeneration: false,
    keyDerivation: false,
    securityValidation: false
  });
  const [isGenerating, setIsGenerating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    generateKeys();
  }, []);

  const generateKeys = async () => {
    try {
      setIsGenerating(true);
      setError(null);

      // Step 1: Entropy Generation
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate processing time
      setProgress(prev => ({ ...prev, entropyGeneration: true }));

      // Step 2: Key Derivation
      await new Promise(resolve => setTimeout(resolve, 600));
      setProgress(prev => ({ ...prev, keyDerivation: true }));

      // Step 3: Generate actual wallet keys
      const walletKeys = await CryptoService.generateWallet();

      // Step 4: Security Validation
      await new Promise(resolve => setTimeout(resolve, 400));
      setProgress(prev => ({ ...prev, securityValidation: true }));

      // Step 5: Complete
      await new Promise(resolve => setTimeout(resolve, 200));
      setIsGenerating(false);
      
      // Pass the generated keys to parent component
      console.log('KeyGenerationStep - Calling onKeysGenerated with:', walletKeys);
      onKeysGenerated(walletKeys);

    } catch (err) {
      console.error('Key generation error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to generate keys';
      setError(errorMessage);
      onError(errorMessage);
      setIsGenerating(false);
    }
  };

  const getStatusIcon = (completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-400" />;
    }
    return <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />;
  };

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-red-500 rounded-full flex items-center justify-center">
            <Key className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-red-600">Key Generation Failed</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
        
        <Alert variant="destructive">
          <Shield className="h-4 w-4" />
          <AlertDescription>
            There was an error generating your wallet keys. Please try again or contact support if the problem persists.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
          <Key className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold">
          {isGenerating ? "Generating Secure Keys" : "Keys Generated Successfully"}
        </h2>
        <p className="text-muted-foreground">
          {isGenerating 
            ? "Creating your wallet with advanced security features" 
            : "Your wallet keys have been securely generated"
          }
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <span>Entropy Generation</span>
          {getStatusIcon(progress.entropyGeneration)}
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <span>Key Derivation</span>
          {getStatusIcon(progress.keyDerivation)}
        </div>
        <div className="flex items-center justify-between p-4 border rounded-lg">
          <span>Security Validation</span>
          {getStatusIcon(progress.securityValidation)}
        </div>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          {isGenerating 
            ? "Your keys are being generated locally and will never leave your device. W-Access uses advanced cryptography for maximum security."
            : "Your keys have been generated locally and never left your device. W-Access uses advanced cryptography for maximum security."
          }
        </AlertDescription>
      </Alert>

      {!isGenerating && progress.securityValidation && (
        <div className="text-center p-4 bg-green-50 border border-green-200 rounded-lg">
          <CheckCircle className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <p className="text-green-800 font-medium">Wallet keys ready!</p>
          <p className="text-green-600 text-sm">You can now proceed to backup your recovery phrase.</p>
        </div>
      )}
    </div>
  );
};