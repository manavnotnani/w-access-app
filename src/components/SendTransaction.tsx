import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Send, ArrowRight, Loader2, CheckCircle, XCircle, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { TransactionService, WalletBalance } from "@/lib/transaction";
import { NameResolutionService } from "@/lib/name-resolution";
import { Wallet } from "@/lib/supabase";
import { PinModal } from "./PinModal";

interface SendTransactionProps {
  wallet: Wallet;
  isOpen: boolean;
  onClose: () => void;
  onTransactionSent?: (txHash: string) => void;
}

export const SendTransaction = ({ wallet, isOpen, onClose, onTransactionSent }: SendTransactionProps) => {
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [walletBalance, setWalletBalance] = useState<WalletBalance | null>(null);
  const [recipientAddress, setRecipientAddress] = useState<string>("");
  const [recipientDisplayName, setRecipientDisplayName] = useState<string>("");
  const [gasEstimate, setGasEstimate] = useState<bigint | null>(null);
  const [isValidatingRecipient, setIsValidatingRecipient] = useState(false);
  const [recipientError, setRecipientError] = useState<string>("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingTransaction, setPendingTransaction] = useState<{ recipient: string; amount: string; address: string } | null>(null);
  const [sponsorshipInfo, setSponsorshipInfo] = useState<{
    willBeSponsored: boolean;
    gasCost: string;
    totalRequired: string;
  } | null>(null);
  const { toast } = useToast();

  // Load wallet balance when component mounts
  useEffect(() => {
    if (isOpen && wallet.address) {
      loadWalletBalance();
    }
  }, [isOpen, wallet.address]);

  // Validate recipient when it changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (recipient.trim()) {
        validateRecipient(recipient.trim());
      } else {
        setRecipientAddress("");
        setRecipientDisplayName("");
        setRecipientError("");
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [recipient]);

  // Estimate gas when recipient and amount change
  useEffect(() => {
    if (recipientAddress && amount && parseFloat(amount) > 0) {
      estimateGas();
      calculateSponsorshipInfo();
    } else {
      setGasEstimate(null);
      setSponsorshipInfo(null);
    }
  }, [recipientAddress, amount]);

  const calculateSponsorshipInfo = async () => {
    if (!recipientAddress || !amount || parseFloat(amount) <= 0) {
      setSponsorshipInfo(null);
      return;
    }

    try {
      const requirements = await TransactionService.getMinimumBalanceRequirements(
        wallet.address,
        amount
      );
      
      setSponsorshipInfo({
        willBeSponsored: requirements.willBeSponsored,
        gasCost: requirements.estimatedGasCost,
        totalRequired: requirements.totalRequired,
      });
    } catch (error) {
      setSponsorshipInfo(null);
    }
  };

  const loadWalletBalance = async () => {
    try {
      const balance = await TransactionService.getWalletBalance(wallet.address);
      setWalletBalance(balance);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load wallet balance",
        variant: "destructive",
      });
    }
  };

  const validateRecipient = async (input: string) => {
    setIsValidatingRecipient(true);
    setRecipientError("");

    try {
      const result = await NameResolutionService.resolveInput(input);
      
      if (result.success && result.address) {
        setRecipientAddress(result.address);
        setRecipientDisplayName(input);
      } else {
        setRecipientAddress("");
        setRecipientDisplayName("");
        setRecipientError(result.error || "Invalid recipient");
      }
    } catch (error) {
      setRecipientAddress("");
      setRecipientDisplayName("");
      setRecipientError("Failed to validate recipient");
    } finally {
      setIsValidatingRecipient(false);
    }
  };

  const estimateGas = async () => {
    try {
      const gas = await TransactionService.estimateGasForTransaction(
        wallet.address,
        recipientAddress,
        amount
      );
      setGasEstimate(gas);
    } catch (error) {
      setGasEstimate(null);
    }
  };

  const handleSend = async () => {
    if (!recipientAddress || !amount || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid recipient and amount",
        variant: "destructive",
      });
      return;
    }

    // Check if PIN authentication is required
    if (TransactionService.requiresPinAuthentication(wallet.id)) {
      setPendingTransaction({
        recipient: recipientDisplayName,
        amount: amount,
        address: recipientAddress
      });
      setShowPinModal(true);
      return;
    }

    await executeTransaction();
  };

  const executeTransaction = async () => {
    if (!recipientAddress || !amount) return;

    setLoading(true);

    try {
      const result = await TransactionService.sendTransaction({
        fromWalletId: wallet.id,
        toAddress: recipientAddress,
        amount: amount,
      });

      if (result.success && result.transactionHash) {
        const description = result.sponsored 
          ? `Successfully sent ${amount} WCO to ${recipientDisplayName} (Gas fees sponsored)`
          : `Successfully sent ${amount} WCO to ${recipientDisplayName}`;
          
        toast({
          title: "Transaction Sent!",
          description: description,
        });

        // Call the callback if provided
        if (onTransactionSent) {
          onTransactionSent(result.transactionHash);
        }

        // Reset form and close dialog
        setRecipient("");
        setAmount("");
        setRecipientAddress("");
        setRecipientDisplayName("");
        onClose();

        // Reload balance
        await loadWalletBalance();
      } else {
        toast({
          title: "Transaction Failed",
          description: result.error || "Failed to send transaction",
          variant: "destructive",
        });
      }
    } catch (error) {
      if (error instanceof Error && error.message === "PIN_REQUIRED") {
        setPendingTransaction({
          recipient: recipientDisplayName,
          amount: amount,
          address: recipientAddress
        });
        setShowPinModal(true);
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePinSubmit = async (pin: string): Promise<boolean> => {
    try {
      const privateKey = await TransactionService.authenticateWithPin(wallet.id, pin);
      if (privateKey) {
        setShowPinModal(false);
        setPendingTransaction(null);
        // Execute the pending transaction
        await executeTransaction();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
    } catch (error) {
    }
  };

  const formatGasCost = (gas: bigint) => {
    // This is a simplified gas cost calculation
    // In reality, you'd multiply by current gas price
    const gasInWCO = Number(gas) / 1e18 * 0.000000001; // Rough estimate
    return gasInWCO.toFixed(6);
  };

  const isValidAmount = () => {
    const amountNum = parseFloat(amount);
    return amountNum > 0 && walletBalance && amountNum <= parseFloat(walletBalance.balance);
  };

  const canSend = () => {
    return recipientAddress && 
           amount && 
           isValidAmount() && 
           !isValidatingRecipient && 
           !recipientError && 
           !loading;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" />
            Send WCO
          </DialogTitle>
          <DialogDescription>
            Send WCO tokens from {wallet.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Wallet Balance */}
          {walletBalance && (
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Available Balance</span>
                  <span className="font-semibold">{walletBalance.balance} WCO</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Recipient Input */}
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <div className="relative">
              <Input
                id="recipient"
                placeholder="Enter address or name (e.g., bob.w-chain)"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                className={recipientError ? "border-destructive" : ""}
              />
              {isValidatingRecipient && (
                <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-muted-foreground" />
              )}
              {recipientAddress && !isValidatingRecipient && (
                <CheckCircle className="absolute right-3 top-3 w-4 h-4 text-green-500" />
              )}
              {recipientError && !isValidatingRecipient && (
                <XCircle className="absolute right-3 top-3 w-4 h-4 text-destructive" />
              )}
            </div>
            
            {/* Recipient Info */}
            {recipientAddress && (
              <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                <Badge variant="outline">{recipientDisplayName}</Badge>
                <span className="text-sm text-muted-foreground">
                  {recipientAddress.slice(0, 8)}...{recipientAddress.slice(-6)}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyToClipboard(recipientAddress)}
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            )}

            {recipientError && (
              <Alert variant="destructive">
                <AlertDescription>{recipientError}</AlertDescription>
              </Alert>
            )}
          </div>

          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (WCO)</Label>
            <Input
              id="amount"
              type="number"
              step="0.000001"
              placeholder="0.000000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className={!isValidAmount() && amount ? "border-destructive" : ""}
            />
            {amount && !isValidAmount() && (
              <Alert variant="destructive">
                <AlertDescription>
                  {parseFloat(amount) <= 0 
                    ? "Amount must be greater than 0"
                    : "Insufficient balance"
                  }
                </AlertDescription>
              </Alert>
            )}
          </div>

          {/* Transaction Preview */}
          {recipientAddress && amount && (gasEstimate || sponsorshipInfo) && (
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Transaction Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span>{amount} WCO</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Gas Cost:</span>
                  <span>
                    {sponsorshipInfo ? sponsorshipInfo.gasCost : formatGasCost(gasEstimate!)} WCO
                    {sponsorshipInfo?.willBeSponsored && (
                      <Badge variant="secondary" className="ml-2">Sponsored</Badge>
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-semibold">
                  <span>Total:</span>
                  <span>
                    {sponsorshipInfo 
                      ? sponsorshipInfo.totalRequired 
                      : (parseFloat(amount) + parseFloat(formatGasCost(gasEstimate!))).toFixed(6)
                    } WCO
                  </span>
                </div>
                {sponsorshipInfo?.willBeSponsored && (
                  <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="flex items-center gap-2 text-sm text-green-700">
                      <CheckCircle className="w-4 h-4" />
                      <span>Gas fees will be sponsored by the platform</span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button 
            onClick={handleSend} 
            disabled={!canSend()}
            className="bg-gradient-primary hover:opacity-90"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Send
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>

      {/* PIN Modal */}
      <PinModal
        isOpen={showPinModal}
        onClose={() => {
          setShowPinModal(false);
          setPendingTransaction(null);
        }}
        onPinSubmit={handlePinSubmit}
        title="Enter PIN to Send Transaction"
        description={
          pendingTransaction 
            ? `Send ${pendingTransaction.amount} WCO to ${pendingTransaction.recipient}`
            : "Please enter your PIN to access your wallet"
        }
        isLoading={loading}
      />
    </Dialog>
  );
};

