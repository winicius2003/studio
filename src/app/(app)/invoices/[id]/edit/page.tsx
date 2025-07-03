'use client';

import { useParams, notFound } from 'next/navigation';
import { doc } from 'firebase/firestore';
import { useDocumentData } from 'react-firebase-hooks/firestore';
import { db } from '@/lib/firebase';
import InvoiceForm from '@/components/invoices/invoice-form';
import { Loader2 } from 'lucide-react';
import type { Invoice } from '@/types';
import { Timestamp } from 'firebase/firestore';


export default function EditInvoicePage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  
  const [invoiceData, loading, error] = useDocumentData(doc(db, 'invoices', id));

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !invoiceData) {
    notFound();
  }

  // Convert Firestore Timestamps to JS Dates
  const invoice: Invoice = {
      ...invoiceData,
      id: id,
      issueDate: (invoiceData.issueDate as Timestamp).toDate(),
      dueDate: (invoiceData.dueDate as Timestamp).toDate(),
  } as Invoice;


  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Invoice {invoice.invoiceNumber}</h1>
        <p className="text-muted-foreground">
          Update the details for your invoice below.
        </p>
      </div>
      <InvoiceForm invoice={invoice} />
    </div>
  );
}
