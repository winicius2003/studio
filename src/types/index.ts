export type User = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  plan: 'free' | 'pro' | 'business';
  language: 'en' | 'es' | 'pt';
  currency: 'USD' | 'EUR' | 'GBP';
};

export type Client = {
  id: string;
  userId: string;
  name: string;
  email: string;
  address: string;
  country: string;
  vatId?: string;
};

export type LineItem = {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
};

export type InvoiceStatus = 'paid' | 'pending' | 'overdue' | 'draft';

export type Invoice = {
  id: string;
  invoiceNumber: string;
  client: Client;
  lineItems: LineItem[];
  status: InvoiceStatus;
  issueDate: Date;
  dueDate: Date;
  subtotal: number;
  tax: number;
  total: number;
  currency: 'USD' | 'EUR' | 'GBP';
  note?: string;
};

export type Product = {
  id: string;
  userId: string;
  name: string;
  description: string;
  unitPrice: number;
  taxRate?: number;
};
