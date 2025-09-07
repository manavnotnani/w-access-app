import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Wallet, Copy, ExternalLink, LogOut, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { walletService } from "@/lib/database";
import { Wallet as WalletType } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { walletSession } from "@/lib/session";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const Dashboard = () => {
  const [wallets, setWallets] = useState<WalletType[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionInfo, setSessionInfo] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadWallets();
    loadSessionInfo();
  }, []);

  const loadSessionInfo = () => {
    const info = walletSession.getSessionInfo();
    setSessionInfo(info);
  };

  const loadWallets = async () => {
    try {
      // Get wallets for current session
      const userWallets = await walletService.getWalletsBySession();
      setWallets(userWallets);
    } catch (error) {
      console.error("Error loading wallets:", error);
      toast({
        title: "Error",
        description: "Failed to load wallets.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: `${label} copied to clipboard.`,
      });
    } catch (error) {
      console.error("Failed to copy:", error);
      toast({
        title: "Error",
        description: "Failed to copy to clipboard.",
        variant: "destructive",
      });
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleLogout = () => {
    walletSession.clearSession();
    setWallets([]);
    setSessionInfo(null);
    toast({
      title: "Session Cleared",
      description: "Your session has been cleared. Wallets will be hidden until you create a new session.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              My Wallets
            </h1>
            <div className="flex items-center gap-2">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Info className="w-4 h-4 mr-2" />
                    Session Info
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Session Information</AlertDialogTitle>
                    <AlertDialogDescription>
                      <div className="space-y-2 mt-4">
                        <p><strong>Session ID:</strong> {sessionInfo?.id?.slice(0, 8)}...</p>
                        <p><strong>Created:</strong> {sessionInfo?.created ? new Date(sessionInfo.created).toLocaleString() : 'Unknown'}</p>
                        <p><strong>Last Access:</strong> {sessionInfo?.lastAccess ? new Date(sessionInfo.lastAccess).toLocaleString() : 'Unknown'}</p>
                        <p><strong>Status:</strong> <span className={sessionInfo?.isValid ? 'text-green-600' : 'text-red-600'}>{sessionInfo?.isValid ? 'Valid' : 'Expired'}</span></p>
                      </div>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Close</AlertDialogCancel>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <LogOut className="w-4 h-4 mr-2" />
                    Clear Session
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Session</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will clear your current session and hide all wallets. You can create a new session by creating a new wallet or refreshing the page.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleLogout}>
                      Clear Session
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              
              <Button
                onClick={() => navigate("/create-wallet")}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Wallet
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground">
            Manage your W-Chain wallets and view their details. Wallets are associated with your current browser session.
          </p>
        </div>

        {/* Wallets Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-3 bg-muted rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-3 bg-muted rounded w-full mb-2"></div>
                  <div className="h-3 bg-muted rounded w-2/3"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : wallets.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Wallet className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold mb-2">No Wallets Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first wallet to get started with W-Chain.
              </p>
              <Button
                onClick={() => navigate("/create-wallet")}
                className="bg-gradient-primary hover:opacity-90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Wallet
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wallets.map((wallet) => (
              <Card key={wallet.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      <Wallet className="w-5 h-5 mr-2" />
                      {wallet.name}.w-chain
                    </CardTitle>
                    <Badge variant="outline">Active</Badge>
                  </div>
                  <CardDescription>
                    Created {formatDate(wallet.created_at)}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">
                      Address
                    </label>
                    <div className="flex items-center justify-between mt-1">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {formatAddress(wallet.address)}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(wallet.address, "Address")}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => copyToClipboard(wallet.address, "Address")}
                    >
                      <Copy className="w-4 h-4 mr-2" />
                      Copy Address
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.open(`https://scan-testnet.w-chain.com/address/${wallet.address}`, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Quick Actions */}
        {wallets.length > 0 && (
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Common actions for managing your wallets.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/create-wallet")}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Wallet
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => navigate("/settings")}
                  >
                    Settings
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;