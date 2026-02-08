import { Info } from 'lucide-react';

export default function PrototypeNoticeBar() {
  return (
    <div className="bg-primary/10 border-b border-primary/20">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-center gap-2 text-sm">
          <Info className="h-4 w-4 text-primary shrink-0" />
          <p className="text-center">
            This is an experimental live market pulse prototype. We are collecting critical feedback to decide what to build next.
          </p>
        </div>
      </div>
    </div>
  );
}
