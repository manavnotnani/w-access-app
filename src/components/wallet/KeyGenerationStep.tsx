import { Alert, AlertDescription } from "@/components/ui/alert";
import { Key, Shield, CheckCircle } from "lucide-react";

export const KeyGenerationStep = () => {
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
};