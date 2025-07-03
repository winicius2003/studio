'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import Header from '@/components/layout/header';
import Sidebar from '@/components/layout/sidebar';
import { Loader2 } from 'lucide-react';

// Define a simpler user type for the header to accommodate both Firebase users and the mock admin
export type DisplayUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<DisplayUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      const isAdminSession = sessionStorage.getItem('isLoggedInAsAdmin') === 'true';

      if (currentUser) {
        setUser({
          uid: currentUser.uid,
          displayName: currentUser.displayName,
          email: currentUser.email,
          photoURL: currentUser.photoURL,
        });
        setLoading(false);
      } else if (isAdminSession) {
        // If there's no Firebase user but an admin session exists, create a mock user
        setUser({
          uid: 'admin',
          displayName: 'Admin User',
          email: 'admin@admin',
          photoURL: null,
        });
        setLoading(false);
      } else {
        // If no user and no admin session, redirect to login
        router.push('/login');
      }
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    // This prevents rendering the layout without a valid user or admin session
    return null;
  }
  
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <Header user={user} />
        <main className="flex-1 bg-background p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
