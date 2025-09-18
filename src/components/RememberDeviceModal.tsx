import React, { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Checkbox } from './ui/checkbox';
import { Loader2, Shield, Eye, EyeOff, Info } from 'lucide-react';

interface RememberDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (pin: string, rememberDevice: boolean) => Promise<void>;
  walletName: string;
  isLoading?: boolean;
}

export const RememberDeviceModal: React.FC<RememberDeviceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  walletName,
  isLoading = false
}) => {
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [rememberDevice, setRememberDevice] = useState(false);
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pinInputRef = useRef<HTMLInputElement>(null);

  const shouldValidateConfirm = pin.length === 6 && confirmPin.length === pin.length;
  const pinsMismatch = shouldValidateConfirm && pin !== confirmPin;

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && pinInputRef.current) {
      pinInputRef.current.focus();
    }
  }, [isOpen]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setPin('');
      setConfirmPin('');
      setRememberDevice(false);
      setError(null);
      setShowPin(false);
      setShowConfirmPin(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rememberDevice) {
      await onConfirm('', false);
      return;
    }

    if (pin.length !== 6) {
      setError('PIN must be exactly 6 digits');
      return;
    }

    if (pin !== confirmPin) {
      setError('PINs do not match');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onConfirm(pin, true);
    } catch (err) {
      setError('Failed to set up device storage. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" onKeyDown={handleKeyDown}>
        <DialogHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <DialogTitle className="text-xl font-semibold">
            Secure Your Wallet
          </DialogTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Choose how you'd like to access your wallet "{walletName}" on this device
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="remember-device"
                checked={rememberDevice}
                onCheckedChange={(checked) => setRememberDevice(checked as boolean)}
                disabled={isSubmitting || isLoading}
              />
              <div className="space-y-1">
                <label
                  htmlFor="remember-device"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  Remember this device
                </label>
                <p className="text-xs text-muted-foreground">
                  Store encrypted keys locally so you only need a PIN to access your wallet
                </p>
              </div>
            </div>

            {rememberDevice && (
              <div className="space-y-4 pl-6 border-l-2 border-muted">
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertDescription className="text-xs">
                    Your private keys will be encrypted with your PIN and stored locally. 
                    You'll only need to enter your PIN for future transactions.
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <label htmlFor="pin" className="text-sm font-medium">
                    Create a PIN
                  </label>
                  <div className="relative">
                    <Input
                      ref={pinInputRef}
                      id="pin"
                      type={showPin ? 'text' : 'password'}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={pin}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setPin(digitsOnly);
                      }}
                      placeholder="Enter 6-digit PIN"
                      className="pr-10"
                      disabled={isSubmitting || isLoading}
                      maxLength={6}
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

                <div className="space-y-2">
                  <label htmlFor="confirm-pin" className="text-sm font-medium">
                    Confirm PIN
                  </label>
                  <div className="relative">
                    <Input
                      id="confirm-pin"
                      type={showConfirmPin ? 'text' : 'password'}
                      inputMode="numeric"
                      pattern="[0-9]*"
                      value={confirmPin}
                      onChange={(e) => {
                        const digitsOnly = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setConfirmPin(digitsOnly);
                      }}
                      placeholder="Confirm 6-digit PIN"
                      className={`pr-10 ${pinsMismatch ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                      disabled={isSubmitting || isLoading}
                      maxLength={6}
                      autoComplete="off"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPin(!showConfirmPin)}
                      disabled={isSubmitting || isLoading}
                    >
                      {showConfirmPin ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  {pinsMismatch && (
                    <p className="text-xs text-destructive">PINs do not match</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
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
              disabled={
                isSubmitting || 
                isLoading || 
                (rememberDevice && (pin.length !== 6 || confirmPin.length !== 6 || pin !== confirmPin))
              }
            >
              {(isSubmitting || isLoading) && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isSubmitting || isLoading ? 'Setting up...' : 'Continue'}
            </Button>
          </div>
        </form>

        <div className="text-xs text-muted-foreground text-center">
          {rememberDevice 
            ? "You can change this setting later in wallet settings."
            : "You can always set up device storage later in wallet settings."
          }
        </div>
      </DialogContent>
    </Dialog>
  );
};
