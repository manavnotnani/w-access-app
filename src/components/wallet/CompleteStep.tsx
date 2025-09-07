import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Shield, Copy, Wallet, AlertTriangle, Loader2, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { FundingService, FundingStatus } from "@/lib/funding";
import { useToast } from "@/hooks/use-toast";
import { GasEstimate } from "@/lib/utils";

interface CompleteStepProps {
  walletName: string;
  walletAddress?: string;
  gasEstimate?: GasEstimate | null;
  isEstimatingGas?: boolean;
}

export const CompleteStep = ({ walletName, walletAddress, gasEstimate, isEstimatingGas }: CompleteStepProps) => {
  const [fundingStatus, setFundingStatus] = useState<FundingStatus | null>(null);
  const [isFunding, setIsFunding] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);
  const { toast } = useToast();

  console.log('CompleteStep - Props received:', {
    walletName,
    walletAddress,
    gasEstimate,
    isEstimatingGas
  });

  useEffect(() => {
    if (walletAddress) {
      checkFundingStatus();
    }
  }, [walletAddress, gasEstimate]);

  // Fallback: If we don't have a gas estimate but have wallet name and address, estimate gas
  useEffect(() => {
    if (walletAddress && walletName && !gasEstimate && !isEstimatingGas) {
      console.log('CompleteStep - Fallback: Estimating gas because gasEstimate is null');
      // We can't estimate gas here because we don't have the private key
      // This is just for debugging - the real fix is in CreateWallet
    }
  }, [walletAddress, walletName, gasEstimate, isEstimatingGas]);

  const checkFundingStatus = async () => {
    if (!walletAddress) return;
    
    setIsCheckingStatus(true);
    try {
      // Use gas estimate amount if available, otherwise use default
      const fundingAmount = gasEstimate ? (parseFloat(gasEstimate.gasCostInWCO) * 1.1).toFixed(6) : "0.32";
      
      console.log('CompleteStep - checkFundingStatus:', {
        gasEstimate,
        gasCostInWCO: gasEstimate?.gasCostInWCO,
        fundingAmount,
        walletAddress
      });
      
      const status = await FundingService.getFundingStatus(walletAddress, fundingAmount);
      setFundingStatus(status);
    } catch (error) {
      console.error('Error checking funding status:', error);
      toast({
        title: "Error",
        description: "Failed to check funding status",
        variant: "destructive",
      });
    } finally {
      setIsCheckingStatus(false);
    }
  };

  const handleFundWallet = async () => {
    if (!walletAddress) return;
    
    setIsFunding(true);
    try {
      let result;
      if (gasEstimate) {
        // Use gas-based funding if gas estimate is available
        result = await FundingService.fundWalletForGas(walletAddress, gasEstimate.gasCostInWCO);
      } else {
        // Fallback to default funding
        result = await FundingService.fundWallet(walletAddress);
      }
      
      if (result.success) {
        const fundingAmount = gasEstimate ? (parseFloat(gasEstimate.gasCostInWCO) * 1.1).toFixed(6) : FundingService.getMinimumFundingAmount();
        toast({
          title: "Wallet Funded Successfully!",
          description: `Your wallet has been funded with ${fundingAmount} WCO tokens.`,
        });
        // Refresh funding status
        await checkFundingStatus();
      } else {
        toast({
          title: "Funding Failed",
          description: result.error || "Failed to fund wallet",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error funding wallet:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred while funding the wallet",
        variant: "destructive",
      });
    } finally {
      setIsFunding(false);
    }
  };

  const handleCopyAddress = async () => {
    if (walletAddress) {
      try {
        await navigator.clipboard.writeText(walletAddress);
        toast({
          title: "Address Copied",
          description: "Wallet address copied to clipboard",
        });
      } catch (error) {
        console.error('Failed to copy address:', error);
        toast({
          title: "Error",
          description: "Failed to copy address",
          variant: "destructive",
        });
      }
    }
  };

  const displayAddress = walletAddress 
    ? `${walletAddress.slice(0, 8)}...${walletAddress.slice(-6)}`
    : "0x1234...5678";

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
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="text-sm text-muted-foreground font-mono">{displayAddress}</div>
                {walletAddress && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyAddress}
                    className="h-6 w-6 p-0"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-center gap-2 flex-wrap">
              <Badge variant="secondary">✓ Secure</Badge>
              <Badge variant="secondary">✓ Backed Up</Badge>
              <Badge variant="secondary">✓ Ready</Badge>
              {fundingStatus?.isFunded && (
                <Badge variant="secondary">✓ Funded</Badge>
              )}
              {gasEstimate && (
                <Badge variant="secondary">
                  <Zap className="w-3 h-3 mr-1" />
                  Gas: {gasEstimate.gasCostInWCO} WCO
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gas Estimation Section */}
      {(gasEstimate || isEstimatingGas) && (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Gas Estimation</h3>
                {isEstimatingGas && <Loader2 className="w-4 h-4 animate-spin text-primary" />}
              </div>
              
              {isEstimatingGas ? (
                <div className="flex items-center justify-center gap-2 text-muted-foreground py-8">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Estimating gas costs...</span>
                </div>
              ) : gasEstimate ? (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Gas:</span>
                        <span className="font-mono">{gasEstimate.estimatedGas.toString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas with Buffer:</span>
                        <span className="font-mono">{gasEstimate.gasWithBuffer.toString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Gas Price:</span>
                        <span className="font-mono">{(Number(gasEstimate.gasPrice) / 1e9).toFixed(2)} gwei</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Total Cost:</span>
                        <span className="font-mono font-semibold text-primary">{gasEstimate.gasCostInWCO} WCO</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
              
              {!fundingStatus?.error && (
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    The wallet will be automatically funded with the exact amount needed for gas fees plus a 10% buffer for safety.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Funding Section */}
      {walletAddress && (
        <Card className="border-primary/20">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Wallet className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Wallet Funding</h3>
              </div>
              
              {isCheckingStatus ? (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking funding status...</span>
                </div>
              ) : fundingStatus ? (
                <div className="space-y-3">
                  {fundingStatus.isFunded ? (
                    <div className="flex items-center gap-2 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span>Wallet is funded and ready to use</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-amber-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span>Wallet needs funding to be fully functional</span>
                      </div>
                      
                      {!fundingStatus.error && (
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <div className="text-sm space-y-1">
                            <div className="flex justify-between">
                              <span>Server Balance:</span>
                              <span className="font-mono">{fundingStatus.balance} WCO</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Funding Amount:</span>
                              <span className="font-mono">{fundingStatus.fundingAmount} WCO</span>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {fundingStatus.error ? (
                        <div className="space-y-3">
                          <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-2">
                            <p>
                              Server balance is low. Please fund your wallet directly to proceed. Send at least
                              <span className="font-semibold"> {fundingStatus.fundingAmount} WCO </span>
                              to the address below:
                            </p>
                            <div className="flex items-center justify-between bg-background/60 rounded-md px-3 py-2 font-mono text-xs">
                              <span>{walletAddress}</span>
                              <Button variant="ghost" size="sm" className="h-7 px-2" onClick={handleCopyAddress}>
                                <Copy className="w-3 h-3 mr-1" /> Copy
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <Button 
                          onClick={handleFundWallet}
                          disabled={isFunding}
                          className="w-full bg-gradient-primary hover:opacity-90"
                        >
                          {isFunding ? (
                            <>
                              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                              Funding Wallet...
                            </>
                          ) : (
                            <>
                              <Wallet className="w-4 h-4 mr-2" />
                              Fund Wallet ({fundingStatus.fundingAmount} WCO)
                            </>
                          )}
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-muted-foreground">
                  Unable to check funding status
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          Your wallet has been created with military-grade security and stored securely in our database. 
          {walletAddress && (
            <span className="block mt-2 text-xs">
              <strong>Wallet Address:</strong> 
              <span className="hidden sm:inline"> {walletAddress}</span>
              <span className="sm:hidden"> {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
            </span>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
};