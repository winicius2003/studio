'use client';

import { useState, useEffect } from 'react';
import { useAuthState as useFirebaseAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import type { User as FirebaseUser } from 'firebase/auth';

// A unified user type that can represent either a Firebase user or our mock admin
export type AppUser = {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  isAdmin: boolean;
};

// This hook will be our single source of truth for the current user.
export function useAuth() {
  const [firebaseUser, firebaseLoading, firebaseError] = useFirebaseAuthState(auth);
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminSession = () => {
      try {
        // sessionStorage is not available on the server, so we need to check.
        return typeof window !== 'undefined' && sessionStorage.getItem('isLoggedInAsAdmin') === 'true';
      } catch (error) {
        return false;
      }
    };
    
    const isAdminSession = checkAdminSession();

    if (firebaseLoading) {
      setLoading(true);
      return;
    }

    if (firebaseUser) {
      setUser({
        uid: firebaseUser.uid,
        displayName: firebaseUser.displayName,
        email: firebaseUser.email,
        photoURL: firebaseUser.photoURL,
        isAdmin: false,
      });
      setLoading(false);
    } else if (isAdminSession) {
      setUser({
        uid: 'admin',
        displayName: 'Admin User',
        email: 'admin@admin',
        photoURL: null,
        isAdmin: true,
      });
      setLoading(false);
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [firebaseUser, firebaseLoading]);

  return { user, loading, error: firebaseError };
}
