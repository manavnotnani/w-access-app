import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Loader2, Shield, Eye, EyeOff } from 'lucide-react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPinSubmit: (pin: string) => Promise<boolean>;
  title?: string;
  description?: string;
  error?: string;
  isLoading?: boolean;
}

export const PinModal: React.FC<PinModalProps> = ({
  isOpen,
  onClose,
  onPinSubmit,
  title = "Enter PIN",
  description = "Please enter your PIN to access your wallet",
  error,
  isLoading = false
}) => {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setSubmitError(null);
      setShowPin(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (pin.length < 4) {
      setSubmitError('PIN must be at least 4 characters');
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const success = await onPinSubmit(pin);
      if (success) {
        setPin('');
        onClose();
      } else {
        setSubmitError('Invalid PIN. Please try again.');
      }
    } catch (err) {
      setSubmitError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const displayError = submitError || error;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onKeyDown={handleKeyDown}>
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Shield className="h-6 w-6 text-blue-600" />
          </div>
          <DialogTitle className="text-xl font-semibold">{title}</DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            {description}
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="pin" className="text-sm font-medium">
              PIN
            </label>
            <div className="relative">
              <Input
                ref={inputRef}
                id="pin"
                type={showPin ? 'text' : 'password'}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Enter your PIN"
                className="pr-10"
                disabled={isSubmitting || isLoading}
                maxLength={20}
                autoComplete="off"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPin(!showPin)}
                disabled={isSubmitting || isLoading}
              >
                {showPin ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {displayError && (
            <Alert variant="destructive">
              <AlertDescription>{displayError}</AlertDescription>
            </Alert>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={isSubmitting || isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={pin.length < 4 || isSubmitting || isLoading}
            >
              {(isSubmitting || isLoading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting || isLoading ? 'Verifying...' : 'Verify PIN'}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground text-center">
          Your PIN is used to decrypt your wallet keys locally. It never leaves your device.
        </div>
      </DialogContent>
    </Dialog>
  );
};



