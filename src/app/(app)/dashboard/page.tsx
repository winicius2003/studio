'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import StatsCards from '@/components/dashboard/stats-cards';
import InvoicesTable from '@/components/dashboard/invoices-table';
import { mockInvoices, mockClients, mockUser } from '@/lib/data';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function Dashboard() {
  const router = useRouter();
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  const handleNewInvoiceClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const isAdminSession = typeof window !== 'undefined' && sessionStorage.getItem('isLoggedInAsAdmin') === 'true';

    // Admin has unlimited access
    if (isAdminSession) {
      router.push('/invoices/new');
      return;
    }

    // For regular users, check plan limits
    const isFreePlan = mockUser.plan === 'free';
    const invoiceLimitReached = mockInvoices.length >= 3;

    if (isFreePlan && invoiceLimitReached) {
      setShowUpgradeDialog(true);
    } else {
      router.push('/invoices/new');
    }
  };

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            <p className="text-muted-foreground">
              Here's a summary of your invoicing activity.
            </p>
          </div>
          <Button onClick={handleNewInvoiceClick}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
        <StatsCards />
        <InvoicesTable
          title="Recent Invoices"
          invoices={mockInvoices}
          clients={mockClients}
        />
      </div>

      <AlertDialog open={showUpgradeDialog} onOpenChange={setShowUpgradeDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Upgrade Required</AlertDialogTitle>
            <AlertDialogDescription>
              You've reached the 3-invoice limit for the Free plan. To create
              more invoices and unlock more features, please upgrade your plan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Link href="/pricing">Upgrade Plan</Link>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
