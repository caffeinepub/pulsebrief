import { Info } from 'lucide-react';

export default function DemoStateIndicator() {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-muted-foreground/20">
      <Info className="h-4 w-4 text-muted-foreground" />
      <span className="text-sm font-medium text-muted-foreground">Sample / Preview</span>
    </div>
  );
}
