import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Plus, Settings, ExternalLink, CheckCircle, Clock, AlertCircle, Loader2 } from "lucide-react";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [existingNames, setExistingNames] = useState<ExistingName[]>([]);
  const [loadingNames, setLoadingNames] = useState(true);
  const { toast } = useToast();

  const searchResults = [
    { name: "alice-dev.w-chain", status: "available", price: "10 W-CHAIN" },
    { name: "alice-nft.w-chain", status: "available", price: "15 W-CHAIN" },
    { name: "alice-defi.w-chain", status: "taken", owner: "0x1111...2222" },
  ];

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
        console.error("Error fetching existing names:", error);
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="existing-names">Existing Names</TabsTrigger>
            <TabsTrigger value="register">Register New</TabsTrigger>
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

          <TabsContent value="register" className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Register New Name</CardTitle>
                <CardDescription>Claim your unique W-Chain identity</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="new-name">Choose your name</Label>
                  <div className="flex mt-1">
                    <Input
                      id="new-name"
                      value={selectedName}
                      onChange={(e) => setSelectedName(e.target.value)}
                      placeholder="yourname"
                      className="rounded-r-none"
                    />
                    <div className="px-3 py-2 bg-muted border border-l-0 rounded-r-md text-sm text-muted-foreground">
                      .w-chain
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    Registration fee: 10 W-CHAIN (1 year) • Premium names may cost more
                  </AlertDescription>
                </Alert>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span>Registration (1 year)</span>
                    <span className="font-semibold">10 W-CHAIN</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <span>Gas Fee (estimated)</span>
                    <span className="font-semibold">0.5 W-CHAIN</span>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-primary/5">
                    <span className="font-semibold">Total</span>
                    <span className="font-bold text-primary">10.5 W-CHAIN</span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-primary hover:opacity-90" disabled={!selectedName}>
                  Register Name
                </Button>
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