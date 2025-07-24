import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Wallet, Plus, Settings, Copy, ExternalLink, Shield, Zap } from "lucide-react";

const Dashboard = () => {
  const wallets = [
    { id: 1, name: "alice.w-chain", address: "0x1234...5678", balance: "1,234.56 W-CHAIN", status: "active" },
    { id: 2, name: "alice-work.w-chain", address: "0x8765...4321", balance: "567.89 W-CHAIN", status: "active" },
  ];

  const recentTransactions = [
    { id: 1, type: "Received", amount: "+50.00 W-CHAIN", from: "bob.w-chain", time: "2 hours ago" },
    { id: 2, type: "Sent", amount: "-25.00 W-CHAIN", to: "charlie.w-chain", time: "1 day ago" },
    { id: 3, type: "Name Registration", amount: "-5.00 W-CHAIN", detail: "alice-work.w-chain", time: "3 days ago" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">Manage your W-Access wallets and transactions</p>
          </div>
          <Button className="bg-gradient-primary hover:opacity-90">
            <Plus className="w-4 h-4 mr-2" />
            Create Wallet
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-primary/20 bg-gradient-subtle">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Wallet className="w-5 h-5 mr-2 text-primary" />
                Active Wallets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary mb-1">2</div>
              <p className="text-sm text-muted-foreground">Secured & Ready</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-subtle">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Zap className="w-5 h-5 mr-2 text-accent" />
                Total Balance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-accent mb-1">1,802.45</div>
              <p className="text-sm text-muted-foreground">W-CHAIN</p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-gradient-subtle">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Security Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-400 mb-1">98%</div>
              <p className="text-sm text-muted-foreground">Excellent</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Wallets */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Your Wallets
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4" />
                </Button>
              </CardTitle>
              <CardDescription>Manage your W-Access wallets</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="p-4 rounded-lg border border-primary/10 bg-background/50">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-primary">{wallet.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        {wallet.status}
                      </Badge>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{wallet.address}</p>
                  <p className="text-sm font-medium text-accent">{wallet.balance}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card className="border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Activity
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </CardTitle>
              <CardDescription>Your latest transactions and activities</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentTransactions.map((tx) => (
                <div key={tx.id} className="p-4 rounded-lg border border-primary/10 bg-background/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-sm">{tx.type}</span>
                    <span className={`font-semibold text-sm ${
                      tx.amount.startsWith('+') ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {tx.amount}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {tx.from && `From: ${tx.from}`}
                    {tx.to && `To: ${tx.to}`}
                    {tx.detail && tx.detail}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">{tx.time}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;