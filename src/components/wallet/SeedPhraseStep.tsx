import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Copy, Eye, EyeOff, Loader2 } from "lucide-react";

interface SeedPhraseStepProps {
  seedPhrase: string[];
  showSeedPhrase: boolean;
  setShowSeedPhrase: (show: boolean) => void;
}

export const SeedPhraseStep = ({ seedPhrase, showSeedPhrase, setShowSeedPhrase }: SeedPhraseStepProps) => {
  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(seedPhrase.join(' '));
      // You could add a toast notification here
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  // Show loading state if seed phrase is not ready
  if (seedPhrase.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold">Preparing Recovery Phrase</h2>
          <p className="text-muted-foreground">Please wait while we generate your secure recovery phrase...</p>
        </div>
      </div>
    );
  }

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
          <Button 
            variant="outline" 
            className="w-full mt-4"
            onClick={handleCopyToClipboard}
            disabled={!showSeedPhrase}
          >
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

      <Alert variant="default" className="border-yellow-200 bg-yellow-50">
        <Shield className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Important:</strong> Write down these words on paper and store them in a secure location. 
          Never share them with anyone or store them digitally.
        </AlertDescription>
      </Alert>
    </div>
  );
};