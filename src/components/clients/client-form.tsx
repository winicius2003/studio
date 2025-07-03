// src/components/clients/client-form.tsx
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { clientSchema, type ClientFormValues } from '@/lib/schemas';
import { db, auth } from '@/lib/firebase';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import type { Client } from '@/types';

interface ClientFormProps {
  client?: Client | null;
  onSuccess: () => void;
}

export default function ClientForm({ client, onSuccess }: ClientFormProps) {
  const [user] = useAuthState(auth);
  const { toast } = useToast();
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      name: client?.name || '',
      email: client?.email || '',
      address: client?.address || '',
      country: client?.country || '',
      vatId: client?.vatId || '',
    },
  });

  const onSubmit = async (values: ClientFormValues) => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'You must be logged in to manage clients.',
      });
      return;
    }

    try {
      if (client) {
        // Update existing client
        const clientRef = doc(db, 'clients', client.id);
        await updateDoc(clientRef, values);
        toast({
          title: 'Success!',
          description: 'Client details have been updated.',
        });
      } else {
        // Add new client
        await addDoc(collection(db, 'clients'), {
          ...values,
          userId: user.uid,
        });
        toast({
          title: 'Success!',
          description: 'New client has been added.',
        });
      }
      onSuccess();
    } catch (error) {
      console.error('Error saving client:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not save client details.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input placeholder="Acme Inc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="contact@acme.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Input placeholder="123 Business St, City" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., Germany" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vatId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VAT ID (Optional)</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., DE123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" disabled={form.formState.isSubmitting}>
            {form.formState.isSubmitting && <Loader2 className="mr-2 animate-spin" />}
          {client ? 'Save Changes' : 'Add Client'}
        </Button>
      </form>
    </Form>
  );
}
