import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Shield } from "lucide-react";

interface CompleteStepProps {
  walletName: string;
}

export const CompleteStep = ({ walletName }: CompleteStepProps) => {
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
              <div className="text-lg font-semibold text-primary whitespace-nowrap">{walletName}.w-chain</div>
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
};