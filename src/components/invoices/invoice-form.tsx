'use client';

import { useState, useEffect } from 'react';
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
import { db, auth } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { mockUser } from '@/lib/data';

interface InvoiceFormProps {
  invoice?: Invoice;
}

export default function InvoiceForm({ invoice }: InvoiceFormProps) {
  const { toast } = useToast();
  const [user, authLoading] = useAuthState(auth);
  const [clients, setClients] = useState<Client[]>([]);
  const [clientsLoading, setClientsLoading] = useState(true);
  const [isAiLoading, setIsAiLoading] = useState(false);

  const form = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      clientId: invoice?.client.id || '',
      issueDate: invoice?.issueDate || new Date(),
      dueDate: invoice?.dueDate || new Date(new Date().setDate(new Date().getDate() + 30)),
      currency: invoice?.currency || 'EUR',
      lineItems: invoice?.lineItems || [{ description: '', quantity: 1, unitPrice: 0 }],
      note: invoice?.note || '',
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
    if (user) {
      const q = query(collection(db, 'clients'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const clientsData: Client[] = [];
        querySnapshot.forEach((doc) => {
          clientsData.push({ id: doc.id, ...doc.data() } as Client);
        });
        setClients(clientsData);
        setClientsLoading(false);
      });
      return () => unsubscribe();
    } else if (!authLoading) {
      setClientsLoading(false);
    }
  }, [user, authLoading]);

  const handleAutofill = async () => {
    const { clientId, currency } = form.getValues();
    if (!clientId) {
      toast({
        variant: 'destructive',
        title: 'Client Required',
        description: 'Please select a client before using AI autofill.',
      });
      return;
    }

    setIsAiLoading(true);
    const result = await getAutofillSuggestions({
      clientId,
      currency,
      userId: user?.uid || 'mock-user-id',
      invoiceItems: [],
    });
    setIsAiLoading(false);

    if (result.success && result.data) {
      form.setValue('lineItems', result.data.suggestedItems);
      form.setValue('note', result.data.suggestedNote);
      toast({
        title: 'AI Autofill Successful',
        description: 'Invoice details have been pre-filled.',
      });
    } else {
      toast({
        variant: 'destructive',
        title: 'AI Autofill Failed',
        description: result.error,
      });
    }
  };

  function onSubmit(values: InvoiceFormValues) {
    console.log(values);
    toast({
      title: 'Invoice Submitted!',
      description: 'Your invoice has been successfully saved.',
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Card>
          <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-2">
            <CardTitle>Invoice Details</CardTitle>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={handleAutofill} disabled={isAiLoading}>
                {isAiLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Autofill with AI
              </Button>
               <Dialog>
                <DialogTrigger asChild>
                  <Button type="button" variant="secondary">
                      <Eye className="mr-2 h-4 w-4" />
                      Preview Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                   <DialogHeader>
                    <DialogTitle>Invoice Preview</DialogTitle>
                  </DialogHeader>
                  <InvoicePreview formData={watchedFormData as InvoiceFormValues} client={selectedClient} user={mockUser}/>
                </DialogContent>
              </Dialog>
            </div>
          </CardHeader>
          <CardContent className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <FormField
              control={form.control}
              name="clientId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Client</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={clientsLoading}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={clientsLoading ? "Loading clients..." : "Select a client"} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {clients.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
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
                <FormItem className="flex flex-col">
                  <FormLabel>Issue Date</FormLabel>
                  <DatePicker field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Due Date</FormLabel>
                  <DatePicker field={field} />
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Line Items</CardTitle>
          </CardHeader>
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
                        <FormControl>
                          <Input placeholder="Item description" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input type="number" placeholder="1" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => append({ description: '', quantity: 1, unitPrice: 0 })}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Item
            </Button>
            <Separator className="my-6" />
            <div className="grid grid-cols-2 gap-4 md:w-1/2 ml-auto">
                <p>Subtotal</p>
                <p className="text-right font-medium">{formatCurrency(subtotal, currency)}</p>
                <p>Tax (23%)</p>
                <p className="text-right font-medium">{formatCurrency(tax, currency)}</p>
                <p className="font-bold">Total</p>
                <p className="text-right font-bold">{formatCurrency(total, currency)}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Additional Details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 md:grid-cols-2">
                 <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Note</FormLabel>
                        <FormControl>
                            <Textarea
                            placeholder="Add a note for your client..."
                            className="resize-none"
                            {...field}
                            />
                        </FormControl>
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
                            <FormControl>
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            </FormControl>
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
                <Button type="button" variant="outline">Save as Draft</Button>
                <Button type="submit">Save and Send</Button>
            </CardFooter>
        </Card>
      </form>
    </Form>
  );
}
