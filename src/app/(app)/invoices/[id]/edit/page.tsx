import InvoiceForm from '@/components/invoices/invoice-form';
import { mockClients, mockInvoices } from '@/lib/data';
import { notFound } from 'next/navigation';

export default function EditInvoicePage({ params }: { params: { id: string } }) {
  const invoice = mockInvoices.find((inv) => inv.id === params.id);
  
  if (!invoice) {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Edit Invoice {invoice.invoiceNumber}</h1>
        <p className="text-muted-foreground">
          Update the details for your invoice below.
        </p>
      </div>
      <InvoiceForm clients={mockClients} invoice={invoice} />
    </div>
  );
}
