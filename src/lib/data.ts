import type { User, Invoice, InvoiceStatus, Client } from '@/types';

// This file now contains only mock user data for preview purposes.
// Invoice data is now fetched from Firestore.

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://placehold.co/100x100.png',
  plan: 'free',
  language: 'en',
  currency: 'EUR',
};
