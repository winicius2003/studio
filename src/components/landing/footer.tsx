import Link from 'next/link';
import { FileText } from 'lucide-react';

export default function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <FileText className="h-6 w-6 text-primary" />
           <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by you, powered by AI.
          </p>
        </div>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © {new Date().getFullYear()} Invoiceo Lite. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
