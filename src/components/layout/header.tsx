'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Home,
  LayoutDashboard,
  Menu,
  Settings,
  Users,
  FileText
} from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { mockUser } from '@/lib/data';

const MobileNav = () => (
    <Sheet>
    <SheetTrigger asChild>
      <Button variant="outline" size="icon" className="shrink-0 md:hidden">
        <Menu className="h-5 w-5" />
        <span className="sr-only">Toggle navigation menu</span>
      </Button>
    </SheetTrigger>
    <SheetContent side="left">
      <nav className="grid gap-6 text-lg font-medium">
        <Link
          href="#"
          className="flex items-center gap-2 text-lg font-semibold"
        >
          <FileText className="h-6 w-6" />
          <span className="sr-only">Invoiceo</span>
        </Link>
        <Link href="/dashboard" className="hover:text-foreground">
          Dashboard
        </Link>
        <Link
          href="/clients"
          className="text-muted-foreground hover:text-foreground"
        >
          Clients
        </Link>
        <Link
          href="/settings"
          className="text-muted-foreground hover:text-foreground"
        >
          Settings
        </Link>
      </nav>
    </SheetContent>
  </Sheet>
)

const UserMenu = () => {
    const user = mockUser;
    const router = useRouter();

    const handleLogout = () => {
      // In a real application, you would call a sign-out method here.
      router.push('/');
    };

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full">
            <Avatar>
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
}

export default function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-card px-4 md:px-6">
      <div className="flex w-full items-center gap-4">
        <MobileNav />
        <div className="flex-1">
            {/* Can add breadcrumbs here */}
        </div>
        <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
        </Button>
        <UserMenu />
      </div>
    </header>
  );
}
