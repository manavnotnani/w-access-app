import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Send, Download, Coins, ArrowRight, ArrowLeft, Wallet } from "lucide-react";
import { useNavigate } from "react-router-dom";

const WalletTutorial = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const tutorialSteps = [
    {
      id: 1,
      title: "Sending Transactions",
      icon: Send,
      description: "Learn how to send tokens to other W-Chain addresses",
      content: {
        title: "How to Send Tokens",
        points: [
          "Click the Send button in your dashboard",
          "Enter the recipient's W-Chain name (e.g., bob.w-chain) or address",
          "Specify the amount you want to send",
          "Review the transaction details and gas fees",
          "Confirm the transaction with your wallet"
        ]
      }
    },
    {
      id: 2,
      title: "Receiving Tokens",
      icon: Download,
      description: "Learn how to receive tokens from other users",
      content: {
        title: "How to Receive Tokens",
        points: [
          "Share your W-Chain name (yourname.w-chain) with the sender",
          "Or share your wallet address from the Receive section",
          "Incoming transactions will appear in your activity feed",
          "Tokens will be automatically added to your balance",
          "No action required on your part once shared"
        ]
      }
    },
    {
      id: 3,
      title: "Managing Assets",
      icon: Coins,
      description: "Learn how to view and manage your digital assets",
      content: {
        title: "Asset Management",
        points: [
          "View all your tokens in the Assets section",
          "Check current balances and values",
          "Monitor transaction history and activity",
          "Add custom tokens by contract address",
          "Hide or favorite frequently used assets"
        ]
      }
    }
  ];

  const currentTutorial = tutorialSteps.find(t => t.id === step);
  const progress = (step / tutorialSteps.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Wallet Tutorial
            </h1>
            <Badge variant="outline">{step} of {tutorialSteps.length}</Badge>
          </div>
          <p className="text-muted-foreground">Learn the basics of using your W-Access wallet</p>
          <Progress value={progress} className="h-2 mt-4" />
        </div>

        {/* Tutorial Content */}
        <Card className="border-primary/20 mb-6">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                {currentTutorial && <currentTutorial.icon className="w-6 h-6 text-white" />}
              </div>
              <div>
                <CardTitle>{currentTutorial?.content.title}</CardTitle>
                <CardDescription>{currentTutorial?.description}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {currentTutorial?.content.points.map((point, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center text-xs font-semibold text-primary mt-0.5">
                    {index + 1}
                  </div>
                  <p className="text-sm leading-relaxed">{point}</p>
                </div>
              ))}
            </div>

            {/* Interactive Demo Section */}
            <div className="mt-6 p-4 bg-gradient-subtle rounded-lg border">
              <h4 className="font-semibold mb-2">Try it yourself:</h4>
              <p className="text-sm text-muted-foreground">
                Once you complete this tutorial, these features will be available in your dashboard.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button
            onClick={() => {
              if (step === tutorialSteps.length) {
                navigate("/dashboard");
              } else {
                setStep(Math.min(tutorialSteps.length, step + 1));
              }
            }}
            className="bg-gradient-primary hover:opacity-90"
          >
            {step === tutorialSteps.length ? 'Go to Dashboard' : 'Next'}
            {step === tutorialSteps.length ? (
              <Wallet className="w-4 h-4 ml-2" />
            ) : (
              <ArrowRight className="w-4 h-4 ml-2" />
            )}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          {tutorialSteps.map((tutorial) => (
            <Card 
              key={tutorial.id} 
              className={`cursor-pointer transition-all hover:border-primary/40 ${
                step === tutorial.id ? 'border-primary/40 bg-primary/5' : ''
              }`}
              onClick={() => setStep(tutorial.id)}
            >
              <CardContent className="p-4 text-center">
                <tutorial.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                <h4 className="font-semibold text-sm">{tutorial.title}</h4>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WalletTutorial;