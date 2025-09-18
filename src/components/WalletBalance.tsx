import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TransactionService, WalletBalance as BalanceType } from "@/lib/transaction";
import { useToast } from "@/hooks/use-toast";

interface WalletBalanceProps {
  walletAddress: string;
  showRefresh?: boolean;
  className?: string;
}

export const WalletBalance = ({ walletAddress, showRefresh = false, className = "" }: WalletBalanceProps) => {
  const [balance, setBalance] = useState<BalanceType | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadBalance = async () => {
    setLoading(true);
    try {
      const walletBalance = await TransactionService.getWalletBalance(walletAddress);
      setBalance(walletBalance);
    } catch (error) {
      console.error("Error loading wallet balance:", error);
      toast({
        title: "Error",
        description: "Failed to load wallet balance",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBalance();
  }, [walletAddress]);

  if (loading && !balance) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <Loader2 className="w-4 h-4 animate-spin" />
        <span className="text-sm text-muted-foreground">Loading balance...</span>
      </div>
    );
  }

  if (!balance) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <span className="text-sm text-muted-foreground">Balance unavailable</span>
        {showRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={loadBalance}
            className="h-6 w-6 p-0"
          >
            <RefreshCw className="w-3 h-3" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
        {parseFloat(balance.balance).toFixed(6)} WCO
      </Badge>
      {showRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={loadBalance}
          disabled={loading}
          className="h-6 w-6 p-0"
        >
          {loading ? (
            <Loader2 className="w-3 h-3 animate-spin" />
          ) : (
            <RefreshCw className="w-3 h-3" />
          )}
        </Button>
      )}
    </div>
  );
};

