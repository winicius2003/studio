'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { PlusCircle, Loader2 } from 'lucide-react';
import StatsCards from '@/components/dashboard/stats-cards';
import InvoicesTable from '@/components/dashboard/invoices-table';
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
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, deleteDoc, doc, Timestamp } from 'firebase/firestore';
import type { Invoice } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

export default function Dashboard() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);

  useEffect(() => {
    if (authLoading) {
      setIsLoading(true);
      return;
    }
    if (user) {
      const q = query(collection(db, 'invoices'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const invoicesData: Invoice[] = snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
              id: doc.id,
              ...data,
              issueDate: (data.issueDate as Timestamp).toDate(),
              dueDate: (data.dueDate as Timestamp).toDate(),
            } as Invoice;
          });
          setInvoices(invoicesData);
          setIsLoading(false);
        },
        (error) => {
          console.error('Error fetching invoices: ', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch invoices.',
          });
          setIsLoading(false);
        }
      );
      return () => unsubscribe();
    } else {
      setInvoices([]);
      setIsLoading(false);
    }
  }, [user, authLoading, toast]);


  const handleNewInvoiceClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (user?.isAdmin) {
      router.push('/invoices/new');
      return;
    }

    // This logic should be adapted to use the user's actual plan from the DB
    const isFreePlan = true; 
    const invoiceLimitReached = invoices.length >= 3;

    if (isFreePlan && invoiceLimitReached) {
      setShowUpgradeDialog(true);
    } else {
      router.push('/invoices/new');
    }
  };

  const handleDeleteInvoice = async (invoiceId: string) => {
    try {
      await deleteDoc(doc(db, 'invoices', invoiceId));
      toast({
        title: 'Success',
        description: 'Invoice deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting invoice: ', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete invoice.',
      });
    }
  };

  if (isLoading) {
    return (
       <div className="space-y-8">
         <div className="flex items-center justify-between">
            <Skeleton className="h-12 w-1/2" />
            <Skeleton className="h-10 w-36" />
         </div>
         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
         </div>
         <Skeleton className="h-96" />
       </div>
    )
  }

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
        <StatsCards invoices={invoices} />
        <InvoicesTable
          title="Recent Invoices"
          invoices={invoices}
          onDelete={handleDeleteInvoice}
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
