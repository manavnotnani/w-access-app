import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Wallet, Shield, CheckCircle, XCircle, Clock } from "lucide-react";
import { useWalletName } from "@/hooks/useWalletName";
import { useEffect } from "react";
import { testSupabaseConnection } from "@/lib/test-connection";

interface WalletNameStepProps {
  walletName: string;
  setWalletName: (name: string) => void;
}

export const WalletNameStep = ({ walletName, setWalletName }: WalletNameStepProps) => {
  const { isChecking, isAvailable, error } = useWalletName(walletName);

  // Test connection on component mount
  useEffect(() => {
    testSupabaseConnection().then(result => {
      if (result.success) {
        console.log('✅ Supabase connection working!');
      } else {
        console.log('❌ Supabase connection failed:', result.error);
      }
    });
  }, []);

  const getStatusBadges = () => {
    if (!walletName) return null;
    
    const badges = [];
    
    // Availability badge
    if (isChecking) {
      badges.push(
        <Badge key="checking" variant="outline" className="text-amber-600 border-amber-200">
          <Clock className="w-3 h-3 mr-1" />
          Checking...
        </Badge>
      );
    } else if (isAvailable === true) {
      badges.push(
        <Badge key="available" variant="outline" className="text-green-600 border-green-200">
          <CheckCircle className="w-3 h-3 mr-1" />
          Available
        </Badge>
      );
    } else if (isAvailable === false) {
      badges.push(
        <Badge key="taken" variant="outline" className="text-red-600 border-red-200">
          <XCircle className="w-3 h-3 mr-1" />
          Already taken
        </Badge>
      );
    }
    
    // Other badges
    if (walletName.length >= 3 && walletName.length <= 20) {
      badges.push(
        <Badge key="length" variant="outline" className="text-green-600 border-green-200">
          Good length
        </Badge>
      );
    }
    
    if (/^[a-zA-Z0-9]+$/.test(walletName)) {
      badges.push(
        <Badge key="format" variant="outline" className="text-green-600 border-green-200">
          Valid format
        </Badge>
      );
    }
    
    return badges;
  };

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
            <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground whitespace-nowrap">
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

        {isAvailable === false && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              This name is already taken. Please try a different one.
            </AlertDescription>
          </Alert>
        )}

        {error && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
        )}

        {getStatusBadges() && (
          <div className="flex gap-2 flex-wrap">
            {getStatusBadges()}
          </div>
        )}
      </div>
    </div>
  );
};
