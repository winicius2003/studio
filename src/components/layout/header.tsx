'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Bell,
  Menu,
  Gem
} from 'lucide-react';
import { FileText } from 'lucide-react';

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
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import type { DisplayUser } from '@/app/(app)/layout';
import { cn } from '@/lib/utils';

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

const UserMenu = ({ user }: { user: DisplayUser }) => {
    const router = useRouter();
    const isAdmin = user.uid === 'admin';

    const handleLogout = async () => {
      if (isAdmin) {
        sessionStorage.removeItem('isLoggedInAsAdmin');
        router.push('/');
      } else {
        try {
          await signOut(auth);
          router.push('/');
        } catch (error) {
            console.error("Logout failed", error);
        }
      }
    };

    const getInitials = (name: string | null): string => {
        if (!name) return "U";
        const names = name.split(' ').filter(Boolean);
        if (names.length > 1) {
            return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    }

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="secondary" size="icon" className="rounded-full relative">
             {isAdmin && (
                <div className="absolute -top-1 -right-1 bg-primary p-0.5 rounded-full">
                    <Gem className="h-3 w-3 text-primary-foreground" />
                </div>
            )}
            <Avatar>
              <AvatarImage src={user.photoURL ?? undefined} alt={user.displayName ?? "User"} />
              <AvatarFallback>{getInitials(user.displayName)}</AvatarFallback>
            </Avatar>
            <span className="sr-only">Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>{user.displayName || user.email}</DropdownMenuLabel>
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

export default function Header({ user }: { user: DisplayUser }) {
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
        <UserMenu user={user} />
      </div>
    </header>
  );
}
