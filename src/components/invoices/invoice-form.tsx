
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { DatePicker } from '@/components/ui/date-picker';
import { Separator } from '@/components/ui/separator';
import { Trash2, PlusCircle, Sparkles, Loader2, Eye } from 'lucide-react';
import { invoiceSchema, type InvoiceFormValues } from '@/lib/schemas';
import type { Client, Invoice, User } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { getAutofillSuggestions } from '@/app/actions';
import InvoicePreview from './invoice-preview';
import { db } from '@/lib/firebase';
import { collection, query, where, onSnapshot, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '@/hooks/use-auth';

interface InvoiceFormProps {
  invoice?: Invoice;
}

export default function InvoiceForm({ invoice }: InvoiceFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const { user, loading: authLoading } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: invoice 
      ? {
          clientId: invoice.client.id,
          issueDate: invoice.issueDate,
          dueDate: invoice.dueDate,
          currency: invoice.currency,
          lineItems: invoice.lineItems,
          note: invoice.note,
        }
      : {
          clientId: '',
          issueDate: new Date(),
          dueDate: new Date(new Date().setDate(new Date().getDate() + 30)),
          currency: 'EUR',
          lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
          note: '',
        },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'lineItems',
  });
  
  const watchedFormData = useWatch({ control: form.control });
  const selectedClientId = form.watch('clientId');
  const selectedClient = clients.find(c => c.id === selectedClientId) || null;

  const currency = form.watch('currency');
  const lineItems = form.watch('lineItems');
  const subtotal = lineItems.reduce((acc, item) => acc + (item.quantity || 0) * (item.unitPrice || 0), 0);
  const tax = subtotal * 0.23; // Example tax rate
  const total = subtotal + tax;

  useEffect(() => {
    if (authLoading) return;
    if (user) {
      const q = query(collection(db, 'clients'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const clientsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Client));
        setClients(clientsData);
        setIsLoadingClients(false);
      }, (error) => {
        console.error("Failed to fetch clients:", error);
        toast({ variant: "destructive", title: "Error", description: "Could not fetch clients." });
        setIsLoadingClients(false);
      });
      return () => unsubscribe();
    } else {
      setClients([]);
      setIsLoadingClients(false);
    }
  }, [user, authLoading, toast]);

  const handleAutofill = async () => {
    if (!user || !form.getValues('clientId')) {
      toast({ variant: 'destructive', title: 'Error', description: 'Please select a client first.' });
      return;
    }
    
    setIsAiLoading(true);
    try {
      const result = await getAutofillSuggestions({
        clientId: form.getValues('clientId'),
        currency: form.getValues('currency'),
        userId: user.uid,
        invoiceItems: form.getValues('lineItems'),
      });

      if (result.success && result.data) {
        form.setValue('lineItems', result.data.suggestedItems);
        form.setValue('note', result.data.suggestedNote);
        toast({ title: 'Success', description: 'AI suggestions applied.' });
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({ variant: 'destructive', title: 'AI Error', description: 'Failed to get AI suggestions.' });
    } finally {
      setIsAiLoading(false);
    }
  };

  const onSubmit = async (values: InvoiceFormValues) => {
    if (!user || !selectedClient) {
      toast({ variant: 'destructive', title: 'Error', description: 'You must be logged in and select a client.' });
      return;
    }

    setIsSubmitting(true);
    
    const invoiceData = {
      ...values,
      userId: user.uid,
      client: selectedClient,
      subtotal,
      tax,
      total,
      status: 'draft' as const,
      invoiceNumber: invoice?.invoiceNumber || `INV-${Date.now()}`,
    };

    try {
      if (invoice) {
        const invoiceRef = doc(db, 'invoices', invoice.id);
        await updateDoc(invoiceRef, invoiceData);
        toast({ title: 'Success!', description: 'Invoice has been updated.' });
      } else {
        await addDoc(collection(db, 'invoices'), invoiceData);
        toast({ title: 'Success!', description: 'New invoice has been created.' });
      }
      router.push('/dashboard');
    } catch (error) {
      console.error('Error saving invoice:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Could not save the invoice.' });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const previewUser: User | null = user ? {
    id: user.uid,
    name: user.displayName || 'Your Company',
    email: user.email || 'your.email@company.com',
    avatarUrl: user.photoURL || undefined,
    plan: user.isAdmin ? 'business' : 'free',
    language: 'en',
    currency: 'EUR',
  } : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle>Invoice Details</CardTitle>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleAutofill} disabled={isAiLoading || isSubmitting}>
                {isAiLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
                Autofill with AI
              </Button>
              {previewUser && (
                <Dialog>
                  <DialogTrigger asChild>
                    <Button type="button" variant="secondary">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Invoice
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader><DialogTitle>Invoice Preview</DialogTitle></DialogHeader>
                    <InvoicePreview 
                      formData={watchedFormData as InvoiceFormValues} 
                      client={selectedClient} 
                      user={previewUser}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoadingClients}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={isLoadingClients ? "Loading..." : "Select a client"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((c) => (<SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Issue Date</FormLabel><DatePicker field={field} /><FormMessage /></FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col"><FormLabel>Due Date</FormLabel><DatePicker field={field} /><FormMessage /></FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Line Items</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-12 items-start gap-4">
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.description`}
                    render={({ field }) => (
                      <FormItem className="col-span-12 md:col-span-6">
                        {index === 0 && <FormLabel>Description</FormLabel>}
                        <FormControl><Input placeholder="Item description" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem className="col-span-4 md:col-span-2">
                        {index === 0 && <FormLabel>Qty</FormLabel>}
                        <FormControl><Input type="number" placeholder="1" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`lineItems.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem className="col-span-4 md:col-span-2">
                        {index === 0 && <FormLabel>Price</FormLabel>}
                        <FormControl><Input type="number" placeholder="0.00" {...field} onChange={e => field.onChange(parseFloat(e.target.value) || 0)} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="col-span-3 md:col-span-1 flex items-end h-full">
                    {index === 0 && <FormLabel className="hidden md:block">&nbsp;</FormLabel>}
                    <p className="w-full text-right pt-2 font-medium">
                      {formatCurrency((form.watch(`lineItems.${index}.quantity`) || 0) * (form.watch(`lineItems.${index}.unitPrice`) || 0), currency)}
                    </p>
                  </div>
                  <div className="col-span-1 flex items-end h-full">
                    {index > 0 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Item
            </Button>
            <Separator className="my-6" />
            <div className="grid grid-cols-2 gap-4 md:w-1/2 ml-auto">
              <p>Subtotal</p><p className="text-right font-medium">{formatCurrency(subtotal, currency)}</p>
              <p>Tax (23%)</p><p className="text-right font-medium">{formatCurrency(tax, currency)}</p>
              <p className="font-bold">Total</p><p className="text-right font-bold">{formatCurrency(total, currency)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Additional Details</CardTitle></CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="note"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Note</FormLabel>
                  <FormControl><Textarea placeholder="Add a note for your client..." className="resize-none" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select currency" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => toast({ title: 'Coming soon!', description: 'Saving as draft will be implemented soon.' })} disabled={isSubmitting}>
              Save as Draft
            </Button>
            <Button type="submit" disabled={isSubmitting || isAiLoading}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {invoice ? 'Save Changes' : 'Save and Send'}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
