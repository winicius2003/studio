import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Clock, AlertCircle } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import type { Invoice } from '@/types';

interface StatsCardsProps {
  invoices: Invoice[];
}

export default function StatsCards({ invoices }: StatsCardsProps) {
  const totalRevenue = invoices
    .filter((invoice) => invoice.status === 'paid')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const outstanding = invoices
    .filter((invoice) => invoice.status === 'pending')
    .reduce((sum, invoice) => sum + invoice.total, 0);

  const overdue = invoices
    .filter((invoice) => invoice.status === 'overdue')
    .reduce((sum, invoice) => sum + invoice.total, 0);
  
  const currency = invoices.length > 0 ? invoices[0].currency : 'EUR';

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(totalRevenue, currency)}
          </div>
          <p className="text-xs text-muted-foreground">
            All-time earnings from paid invoices.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Outstanding</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(outstanding, currency)}
          </div>
          <p className="text-xs text-muted-foreground">
            Amount pending from clients.
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Overdue</CardTitle>
          <AlertCircle className="h-4 w-4 text-destructive" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-destructive">
            {formatCurrency(overdue, currency)}
          </div>
          <p className="text-xs text-muted-foreground">
            Amount from invoices past their due date.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
