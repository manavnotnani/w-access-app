import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Plus, ExternalLink, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
import { walletService } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

interface ExistingName {
  name: string;
  address: string;
  status: string;
  expires: string;
  primary: boolean;
  created_at: string;
}

const NameService = () => {
  const [existingNames, setExistingNames] = useState<ExistingName[]>([]);
  const [loadingNames, setLoadingNames] = useState(true);
  const { toast } = useToast();


  // Fetch existing names from database
  useEffect(() => {
    const fetchExistingNames = async () => {
      try {
        setLoadingNames(true);
        const wallets = await walletService.getAllWallets();
        
        // Transform wallet data to match the existing format
        const names: ExistingName[] = wallets.map((wallet, index) => ({
          name: `${wallet.name}.w-chain`,
          address: wallet.address,
          status: "active", // All registered names are considered active
          expires: "365 days", // Default expiration (this could be enhanced later)
          primary: index === 0, // First wallet is considered primary
          created_at: wallet.created_at
        }));
        
        setExistingNames(names);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load existing names from database.",
          variant: "destructive",
        });
      } finally {
        setLoadingNames(false);
      }
    };

    fetchExistingNames();
  }, [toast]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "pending": return <Clock className="w-4 h-4 text-yellow-400" />;
      case "available": return <Plus className="w-4 h-4 text-blue-400" />;
      case "taken": return <AlertCircle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400";
      case "pending": return "text-yellow-400";
      case "available": return "text-blue-400";
      case "taken": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Name Service
          </h1>
          <p className="text-muted-foreground">Register and manage human-readable addresses on W-Chain</p>
        </div>



        {/* Main Content */}
        <Tabs defaultValue="existing-names" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing-names">Existing Names</TabsTrigger>
            <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
          </TabsList>

          <TabsContent value="existing-names" className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Existing Registered Names</CardTitle>
                <CardDescription>All registered W-Chain names in the system</CardDescription>
              </CardHeader>
              <CardContent>
                {loadingNames ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin mr-2" />
                    <span>Loading existing names...</span>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {existingNames.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                          <Search className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-xl font-semibold mb-2">No Names Found</h3>
                        <p className="text-muted-foreground">
                          No registered names found in the system yet.
                        </p>
                      </div>
                    ) : (
                      existingNames.map((name, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-background/50">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(name.status)}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-primary">{name.name}</span>
                              {name.primary && <Badge variant="secondary">Primary</Badge>}
                            </div>
                            <div className="text-sm text-muted-foreground">{name.address}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          {name.status === "active" ? `` : "Registration pending"}
                        </span>
                        {name.status === "active" }
                      </div>
                    </div>
                      ))
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>


          <TabsContent value="marketplace" className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Name Marketplace</CardTitle>
                <CardDescription>Buy and sell premium W-Chain names</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center mb-4">
                    <ExternalLink className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Marketplace Coming Soon</h3>
                  <p className="text-muted-foreground">
                    The secondary marketplace for trading W-Chain names will be available soon.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default NameService;