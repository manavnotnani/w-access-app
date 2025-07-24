import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, Key, AlertTriangle, CheckCircle, RefreshCw, Download, Upload } from "lucide-react";

const Recovery = () => {
  const [seedPhrase, setSeedPhrase] = useState(Array(12).fill(""));
  const [recoveryMethod, setRecoveryMethod] = useState<string>("");

  const handleSeedPhraseChange = (index: number, value: string) => {
    const newSeedPhrase = [...seedPhrase];
    newSeedPhrase[index] = value;
    setSeedPhrase(newSeedPhrase);
  };

  const backupMethods = [
    {
      id: "cloud",
      title: "Cloud Backup",
      description: "Encrypted backup stored securely in the cloud",
      status: "active",
      lastBackup: "2 hours ago"
    },
    {
      id: "social",
      title: "Social Recovery",
      description: "Recover using trusted contacts",
      status: "configured",
      guardians: 3
    },
    {
      id: "hardware",
      title: "Hardware Backup",
      description: "Physical security key backup",
      status: "not-configured",
      lastBackup: null
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "text-green-400";
      case "configured": return "text-blue-400";
      case "not-configured": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active": return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "configured": return <Shield className="w-4 h-4 text-blue-400" />;
      case "not-configured": return <AlertTriangle className="w-4 h-4 text-red-400" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
            Wallet Recovery
          </h1>
          <p className="text-muted-foreground">Manage your wallet backup and recovery options</p>
        </div>

        <Tabs defaultValue="backup" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="backup">Backup Methods</TabsTrigger>
            <TabsTrigger value="recover">Recover Wallet</TabsTrigger>
            <TabsTrigger value="security">Security Center</TabsTrigger>
          </TabsList>

          <TabsContent value="backup" className="space-y-6">
            <Alert>
              <Shield className="h-4 w-4" />
              <AlertTitle>Multiple Backup Options</AlertTitle>
              <AlertDescription>
                W-Access provides multiple ways to backup and recover your wallet. Enable multiple methods for maximum security.
              </AlertDescription>
            </Alert>

            <div className="grid gap-6">
              {backupMethods.map((method) => (
                <Card key={method.id} className="border-primary/20">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getStatusIcon(method.status)}
                        <div>
                          <CardTitle className="text-lg">{method.title}</CardTitle>
                          <CardDescription>{method.description}</CardDescription>
                        </div>
                      </div>
                      <Badge variant={method.status === "active" ? "default" : "outline"}>
                        {method.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground">
                        {method.lastBackup && `Last backup: ${method.lastBackup}`}
                        {method.guardians && `${method.guardians} guardians configured`}
                        {method.status === "not-configured" && "Not configured"}
                      </div>
                      <div className="flex gap-2">
                        {method.status === "active" && (
                          <Button variant="outline" size="sm">
                            <RefreshCw className="w-4 h-4 mr-2" />
                            Backup Now
                          </Button>
                        )}
                        <Button 
                          variant={method.status === "not-configured" ? "default" : "outline"} 
                          size="sm"
                          className={method.status === "not-configured" ? "bg-gradient-primary hover:opacity-90" : ""}
                        >
                          {method.status === "not-configured" ? "Setup" : "Configure"}
                        </Button>
                      </div>
                    </div>

                    {method.id === "cloud" && method.status === "active" && (
                      <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          Your wallet is automatically backed up to encrypted cloud storage
                        </div>
                      </div>
                    )}

                    {method.id === "social" && method.status === "configured" && (
                      <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                        <div className="text-blue-400 text-sm">
                          Recovery requires approval from 2 of 3 guardians
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="recover" className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Wallet Recovery</AlertTitle>
              <AlertDescription>
                Enter your recovery phrase or use alternative recovery methods to restore your wallet.
              </AlertDescription>
            </Alert>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Recovery Methods</CardTitle>
                <CardDescription>Choose how you want to recover your wallet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button
                    variant={recoveryMethod === "seed" ? "default" : "outline"}
                    onClick={() => setRecoveryMethod("seed")}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Key className="w-6 h-6" />
                    <span>Seed Phrase</span>
                  </Button>
                  <Button
                    variant={recoveryMethod === "cloud" ? "default" : "outline"}
                    onClick={() => setRecoveryMethod("cloud")}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Download className="w-6 h-6" />
                    <span>Cloud Backup</span>
                  </Button>
                  <Button
                    variant={recoveryMethod === "social" ? "default" : "outline"}
                    onClick={() => setRecoveryMethod("social")}
                    className="h-auto p-4 flex flex-col items-center gap-2"
                  >
                    <Shield className="w-6 h-6" />
                    <span>Social Recovery</span>
                  </Button>
                </div>

                {recoveryMethod === "seed" && (
                  <div className="space-y-4">
                    <Label>Enter your 12-word recovery phrase</Label>
                    <div className="grid grid-cols-3 gap-3">
                      {seedPhrase.map((word, index) => (
                        <div key={index} className="space-y-1">
                          <Label className="text-xs text-muted-foreground">{index + 1}</Label>
                          <Input
                            value={word}
                            onChange={(e) => handleSeedPhraseChange(index, e.target.value)}
                            placeholder="word"
                            className="text-center font-mono"
                          />
                        </div>
                      ))}
                    </div>
                    <Button className="w-full bg-gradient-primary hover:opacity-90">
                      Recover Wallet
                    </Button>
                  </div>
                )}

                {recoveryMethod === "cloud" && (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                      <Download className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Cloud Recovery</h3>
                    <p className="text-muted-foreground">
                      We'll help you recover your wallet from your encrypted cloud backup.
                    </p>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Start Cloud Recovery
                    </Button>
                  </div>
                )}

                {recoveryMethod === "social" && (
                  <div className="space-y-4 text-center">
                    <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
                      <Shield className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold">Social Recovery</h3>
                    <p className="text-muted-foreground">
                      Contact your trusted guardians to initiate wallet recovery.
                    </p>
                    <Button className="bg-gradient-primary hover:opacity-90">
                      Request Guardian Approval
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle>Security Score</CardTitle>
                <CardDescription>Your wallet security rating and recommendations</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-green-400 mb-2">98%</div>
                  <p className="text-muted-foreground">Excellent Security</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Seed phrase backed up</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      ✓ Complete
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-green-500/10 border-green-500/20">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <span>Cloud backup enabled</span>
                    </div>
                    <Badge variant="outline" className="text-green-400 border-green-400">
                      ✓ Active
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg bg-yellow-500/10 border-yellow-500/20">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-400" />
                      <span>Hardware backup</span>
                    </div>
                    <Button variant="outline" size="sm">
                      Setup
                    </Button>
                  </div>
                </div>

                <Alert>
                  <Shield className="h-4 w-4" />
                  <AlertDescription>
                    Consider enabling hardware backup for maximum security. This adds an extra layer of protection for your wallet.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Recovery;