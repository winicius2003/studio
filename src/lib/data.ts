import type { User, Client, Invoice, InvoiceStatus } from '@/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Alex Doe',
  email: 'alex.doe@example.com',
  avatarUrl: 'https://placehold.co/100x100.png',
  plan: 'free',
  language: 'en',
  currency: 'EUR',
};

export const mockClients: Client[] = [
  { id: 'client-1', name: 'Tech Solutions Ltd.', email: 'contact@techsolutions.com', country: 'Ireland' },
  { id: 'client-2', name: 'Creative Agency SL', email: 'hola@creative.es', country: 'Spain' },
  { id: 'client-3', name: 'Inovação & Cia', email: 'contato@inovacao.pt', country: 'Portugal' },
];

const createMockInvoice = (id: number, client: Client, status: InvoiceStatus, daysOffset: number, dueDays: number): Invoice => {
  const issueDate = new Date();
  issueDate.setDate(issueDate.getDate() - daysOffset);
  const dueDate = new Date(issueDate);
  dueDate.setDate(dueDate.getDate() + dueDays);

  const lineItems = [
    { id: `li-1-${id}`, description: 'Web Design Consultation', quantity: 2, unitPrice: 150 },
    { id: `li-2-${id}`, description: 'Frontend Development', quantity: 25, unitPrice: 80 },
  ];

  const subtotal = lineItems.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0);
  const tax = subtotal * 0.23;
  const total = subtotal + tax;

  return {
    id: `inv-${id}`,
    invoiceNumber: `2024-${String(id).padStart(4, '0')}`,
    client,
    lineItems,
    status,
    issueDate,
    dueDate,
    subtotal,
    tax,
    total,
    currency: 'EUR',
    note: 'Thank you for your business.',
  };
};

export const mockInvoices: Invoice[] = [
  createMockInvoice(1, mockClients[0], 'paid', 45, 30),
  createMockInvoice(2, mockClients[1], 'pending', 20, 30),
  createMockInvoice(3, mockClients[2], 'overdue', 40, 30),
  createMockInvoice(4, mockClients[0], 'pending', 10, 30),
  createMockInvoice(5, mockClients[1], 'draft', 2, 30),
];
