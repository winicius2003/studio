'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, Settings, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/clients', icon: Users, label: 'Clients' },
  { href: '/settings', icon: Settings, label: 'Settings' },
];

const Logo = () => (
  <div className="flex h-16 items-center justify-center bg-primary text-primary-foreground">
    <FileText className="h-8 w-8" />
    <span className="ml-2 text-xl font-bold tracking-tight">Invoiceo</span>
  </div>
);

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 flex-col bg-card text-card-foreground shadow-lg md:flex">
      <Logo />
      <nav className="flex-1 p-4">
        <TooltipProvider>
          <ul>
            {navItems.map((item) => (
              <li key={item.href}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link
                      href={item.href}
                      className={cn(
                        'flex items-center rounded-md p-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                        pathname.startsWith(item.href)
                          ? 'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground'
                          : 'text-muted-foreground'
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="ml-4">{item.label}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              </li>
            ))}
          </ul>
        </TooltipProvider>
      </nav>
      <div className="p-4">
         {/* Placeholder for plan info or upgrade button */}
      </div>
    </aside>
  );
}
