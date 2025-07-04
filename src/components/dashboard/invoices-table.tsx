'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import type { Invoice, InvoiceStatus, Client } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface InvoicesTableProps {
  title: string;
  invoices: Invoice[];
  onDelete: (invoiceId: string) => void;
}

const statusVariant: { [key in InvoiceStatus]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
  paid: 'default',
  pending: 'secondary',
  overdue: 'destructive',
  draft: 'outline',
};

const statusColor: { [key in InvoiceStatus]: string } = {
    paid: 'bg-green-500',
    pending: 'bg-yellow-500',
    overdue: 'bg-red-500',
    draft: 'bg-gray-500',
}

export default function InvoicesTable({ title, invoices, onDelete }: InvoicesTableProps) {
    const [isAlertOpen, setIsAlertOpen] = useState(false);
    const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);

    const handleDeleteClick = (invoiceId: string) => {
        setSelectedInvoiceId(invoiceId);
        setIsAlertOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedInvoiceId) {
            onDelete(selectedInvoiceId);
        }
        setIsAlertOpen(false);
        setSelectedInvoiceId(null);
    }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>
          {invoices.length > 0
            ? 'A list of your recent invoices.'
            : 'No invoices found. Create one to get started!'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead className="hidden sm:table-cell">Status</TableHead>
              <TableHead className="hidden md:table-cell">Issued</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="w-[50px]">
                <span className="sr-only">Actions</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <div className="font-medium">{invoice.client.name}</div>
                  <div className="hidden text-sm text-muted-foreground md:inline">
                    {invoice.invoiceNumber}
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  <Badge variant={statusVariant[invoice.status]} className="capitalize">
                    <span className={cn("mr-2 h-2 w-2 rounded-full", statusColor[invoice.status])} />
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  {invoice.issueDate.toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(invoice.total, invoice.currency)}
                </TableCell>
                <TableCell>
                  <AlertDialog open={isAlertOpen && selectedInvoiceId === invoice.id} onOpenChange={setIsAlertOpen}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/invoices/${invoice.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Download PDF</DropdownMenuItem>
                         <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDeleteClick(invoice.id)}
                         >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete this invoice.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setSelectedInvoiceId(null)}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleConfirmDelete}>
                          Continue
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
