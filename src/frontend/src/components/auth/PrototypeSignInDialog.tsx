import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { usePrototypeSession } from '@/state/usePrototypeSession';
import { toast } from 'sonner';

interface PrototypeSignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDismiss: () => void;
}

export default function PrototypeSignInDialog({
  open,
  onOpenChange,
  onDismiss,
}: PrototypeSignInDialogProps) {
  const { setEmail } = usePrototypeSession();
  const [localEmail, setLocalEmail] = useState('');

  const handleSignIn = () => {
    if (!localEmail || !localEmail.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }
    setEmail(localEmail);
    toast.success('Signed in successfully');
    onOpenChange(false);
  };

  const handleDismiss = () => {
    onOpenChange(false);
    onDismiss();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleDismiss()}>
      <DialogContent onEscapeKeyDown={handleDismiss} onPointerDownOutside={handleDismiss}>
        <DialogHeader>
          <DialogTitle>Sign In</DialogTitle>
          <DialogDescription>Enter your email to get started with PulseBrief</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dialog-email">Email</Label>
            <Input
              id="dialog-email"
              type="email"
              placeholder="you@example.com"
              value={localEmail}
              onChange={(e) => setLocalEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSignIn()}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSignIn} className="flex-1">
              Sign In
            </Button>
            <Button variant="outline" onClick={handleDismiss} className="flex-1">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
