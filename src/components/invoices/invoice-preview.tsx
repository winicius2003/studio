// src/components/invoices/invoice-preview.tsx
'use client';

import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { InvoiceFormValues } from '@/lib/schemas';
import type { Client, User } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { format } from 'date-fns';

interface InvoicePreviewProps {
  formData: InvoiceFormValues;
  client: Client | null;
  user: User;
}

export default function InvoicePreview({
  formData,
  client,
  user,
}: InvoicePreviewProps) {
  const { lineItems, currency, issueDate, dueDate, note } = formData;
  const subtotal = lineItems.reduce(
    (acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0),
    0
  );
  const tax = subtotal * 0.23; // Example tax rate
  const total = subtotal + tax;

  return (
    <ScrollArea className="h-[70vh]">
      <div className="p-8 bg-white text-black text-sm font-sans shadow-lg rounded-lg border">
        {/* Header */}
        <header className="flex justify-between items-start pb-8 border-b-2 border-gray-200">
          <div>
            <h1 className="text-4xl font-bold text-primary">INVOICE</h1>
            <p className="text-gray-500 mt-1">
              Invoice #: 2024-PREVIEW
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-gray-600">{user.email}</p>
            {/* Add user address here if available */}
          </div>
        </header>

        {/* Client & Dates */}
        <section className="grid grid-cols-2 gap-8 my-8">
          <div>
            <h3 className="text-gray-500 font-semibold mb-2">BILL TO</h3>
            {client ? (
              <>
                <p className="font-bold">{client.name}</p>
                <p className="text-gray-600">{client.address}</p>
                <p className="text-gray-600">{client.email}</p>
                {client.vatId && <p className="text-gray-600">VAT ID: {client.vatId}</p>}
              </>
            ) : (
              <p className="text-gray-400">Select a client...</p>
            )}
          </div>
          <div className="text-right">
             <div className="grid grid-cols-2">
                <p className="font-semibold">Issue Date:</p>
                <p>{issueDate ? format(issueDate, 'PPP') : '...'}</p>
             </div>
             <div className="grid grid-cols-2 mt-2">
                <p className="font-semibold">Due Date:</p>
                <p>{dueDate ? format(dueDate, 'PPP') : '...'}</p>
             </div>
          </div>
        </section>

        {/* Line Items Table */}
        <section>
          <table className="w-full text-left">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-3 font-semibold">Description</th>
                <th className="p-3 font-semibold text-center w-24">Quantity</th>
                <th className="p-3 font-semibold text-right w-32">Unit Price</th>
                <th className="p-3 font-semibold text-right w-32">Total</th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="p-3">{item.description || '...'}</td>
                  <td className="p-3 text-center">{item.quantity || 0}</td>
                  <td className="p-3 text-right">
                    {formatCurrency(item.unitPrice || 0, currency)}
                  </td>
                  <td className="p-3 text-right">
                    {formatCurrency(
                      (item.quantity || 0) * (item.unitPrice || 0),
                      currency
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Totals */}
        <section className="flex justify-end mt-8">
          <div className="w-full max-w-xs space-y-3">
            <div className="flex justify-between">
              <p className="text-gray-600">Subtotal:</p>
              <p>{formatCurrency(subtotal, currency)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-gray-600">Tax (23%):</p>
              <p>{formatCurrency(tax, currency)}</p>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <p>Total:</p>
              <p>{formatCurrency(total, currency)}</p>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t-2 border-gray-200">
            {note && (
                <div>
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-gray-600">{note}</p>
                </div>
            )}
          <p className="text-center text-gray-500 mt-8">
            Thank you for your business!
          </p>
        </footer>
      </div>
    </ScrollArea>
  );
}
