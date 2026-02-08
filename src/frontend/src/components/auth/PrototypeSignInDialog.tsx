import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
  const handleDismiss = () => {
    onOpenChange(false);
    onDismiss();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleDismiss()}>
      <DialogContent onEscapeKeyDown={handleDismiss} onPointerDownOutside={handleDismiss}>
        <DialogHeader>
          <DialogTitle>Feedback Mode</DialogTitle>
          <DialogDescription>This prototype is in feedback collection mode.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <p className="text-sm text-muted-foreground">
            We're collecting feedback to decide what to build next. Use the "Give Feedback" button in the navigation to share your thoughts.
          </p>
          <Button variant="outline" onClick={handleDismiss} className="w-full">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
