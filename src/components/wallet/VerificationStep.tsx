import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMemo } from "react";
import { CheckCircle, Loader2 } from "lucide-react";

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
  // Show loading state if seed phrase is not ready
  if (seedPhrase.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gradient-primary rounded-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-2xl font-bold">Preparing Verification</h2>
          <p className="text-muted-foreground">Please wait while we prepare your verification test...</p>
        </div>
      </div>
    );
  }

  const handleWordSelection = (wordIndex: number, selectedWord: string) => {
    if (selectedWord === seedPhrase[wordIndex]) {
      if (!confirmedWords.includes(wordIndex)) {
        setConfirmedWords([...confirmedWords, wordIndex]);
      }
    }
  };

  // Generate a randomized set of options for a given correct word.
  // This will be called inside a memoized block so the positions remain stable per render lifecycle.
  const getRandomWords = (correctWord: string) => {
    // Common BIP39 words for better verification
    const commonWords = [
      "abandon", "ability", "able", "about", "above", "absent", "absorb", "abstract", "absurd", "abuse",
      "access", "accident", "account", "achieve", "acid", "acoustic", "acquire", "across", "act", "action",
      "zebra", "zero", "zone", "zoo", "zoom", "zulu", "zombie", "zodiac", "zone", "zoo"
    ];
    
    // Filter out the correct word and get random words
    const availableWords = commonWords.filter(word => word !== correctWord);
    const shuffled = availableWords.sort(() => 0.5 - Math.random());
    const randomWords = shuffled.slice(0, 2);
    
    // Add correct word and shuffle all options
    const allOptions = [...randomWords, correctWord];
    return allOptions.sort(() => 0.5 - Math.random());
  };

  // Memoize the options for each verification word so they don't reshuffle after each click/re-render
  const optionsByWordIndex = useMemo(() => {
    const mapping: Record<number, string[]> = {};
    verificationWords.forEach((idx) => {
      const correctWord = seedPhrase[idx];
      mapping[idx] = getRandomWords(correctWord);
    });
    return mapping;
    // Stringify deps to ensure stable memoization across shallow array identity changes
  }, [seedPhrase.join(" "), verificationWords.join(",")]);

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
        {verificationWords.map((wordIndex) => {
          const correctWord = seedPhrase[wordIndex];
          const options = optionsByWordIndex[wordIndex] || [];
          const isConfirmed = confirmedWords.includes(wordIndex);
          
          return (
            <div key={wordIndex} className="space-y-2">
              <Label>Word #{wordIndex + 1}</Label>
              <div className="grid grid-cols-3 gap-2">
                {options.map((option, i) => (
                  <Button
                    key={i}
                    variant={
                      isConfirmed && option === correctWord 
                        ? "default" 
                        : "outline"
                    }
                    onClick={() => handleWordSelection(wordIndex, option)}
                    disabled={isConfirmed}
                    className="h-auto p-3"
                  >
                    {option}
                  </Button>
                ))}
              </div>
              {isConfirmed && (
                <div className="flex items-center text-green-600 text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Correct!
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="text-center p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-blue-800 text-sm">
          <strong>Progress:</strong> {confirmedWords.length} of {verificationWords.length} words verified
        </p>
      </div>
    </div>
  );
};