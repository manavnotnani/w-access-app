import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, Shield } from "lucide-react";

interface WalletNameStepProps {
  walletName: string;
  setWalletName: (name: string) => void;
}

export const WalletNameStep = ({ walletName, setWalletName }: WalletNameStepProps) => {
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
          <div className="flex mt-1 overflow-hidden rounded-l-md">
            <div className="relative flex-1">
              <Input
                id="wallet-name"
                value={walletName}
                onChange={(e) => setWalletName(e.target.value)}
                placeholder="alice"
                className="rounded-r-none border-r-0 focus:outline-none focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                style={{
                  outline: 'none',
                  boxShadow: 'none',
                  borderRight: 'none'
                }}
              />
            </div>
            <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground whitespace-nowrap flex items-center h-10">
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
}; 