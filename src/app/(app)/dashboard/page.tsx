import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';
import StatsCards from '@/components/dashboard/stats-cards';
import InvoicesTable from '@/components/dashboard/invoices-table';
import { mockInvoices, mockClients } from '@/lib/data';

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Here's a summary of your invoicing activity.
          </p>
        </div>
        <Link href="/invoices/new">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </Link>
      </div>
      <StatsCards />
      <InvoicesTable
        title="Recent Invoices"
        invoices={mockInvoices}
        clients={mockClients}
      />
    </div>
  );
}
