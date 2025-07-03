import InvoiceForm from '@/components/invoices/invoice-form';

export default function NewInvoicePage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">New Invoice</h1>
        <p className="text-muted-foreground">
          Fill out the form below to create a new invoice.
        </p>
      </div>
      <InvoiceForm />
    </div>
  );
}
