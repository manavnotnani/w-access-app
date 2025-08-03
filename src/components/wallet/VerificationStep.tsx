import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { CheckCircle } from "lucide-react";

interface VerificationStepProps {
  seedPhrase: string[];
  verificationWords: number[];
  confirmedWords: number[];
  setConfirmedWords: (words: number[]) => void;
}

export const VerificationStep = ({ 
  seedPhrase, 
  verificationWords, 
  confirmedWords, 
  setConfirmedWords 
}: VerificationStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Verify Your Backup</h2>
        <p className="text-muted-foreground">Select the correct words to verify your backup</p>
      </div>

      <div className="space-y-4">
        {verificationWords.map((wordIndex) => (
          <div key={wordIndex} className="space-y-2">
            <Label>Word #{wordIndex + 1}</Label>
            <div className="grid grid-cols-3 gap-2">
              {["abandon", "zebra", seedPhrase[wordIndex]].map((option, i) => (
                <Button
                  key={i}
                  variant={confirmedWords.includes(wordIndex) && option === seedPhrase[wordIndex] ? "default" : "outline"}
                  onClick={() => {
                    if (option === seedPhrase[wordIndex]) {
                      setConfirmedWords([...confirmedWords, wordIndex]);
                    }
                  }}
                  className="h-auto p-3"
                >
                  {option}
                </Button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};