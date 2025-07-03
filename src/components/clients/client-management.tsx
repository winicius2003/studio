// src/components/clients/client-management.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/hooks/use-auth';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MoreHorizontal, PlusCircle, Trash2, Edit } from 'lucide-react';
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
import ClientForm from './client-form';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import type { Client } from '@/types';

export default function ClientManagement() {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    // Wait until the auth state is determined
    if (authLoading) {
      setIsLoading(true);
      return;
    }

    // If there's a user, fetch their clients
    if (user) {
      const q = query(collection(db, 'clients'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(
        q,
        (querySnapshot) => {
          const clientsData: Client[] = [];
          querySnapshot.forEach((doc) => {
            clientsData.push({ id: doc.id, ...doc.data() } as Client);
          });
          setClients(clientsData);
          setIsLoading(false); // Data is loaded or is empty
        },
        (error) => {
          console.error('Error fetching clients:', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not fetch clients from the database.',
          });
          setIsLoading(false);
        }
      );
      // Cleanup subscription on unmount
      return () => unsubscribe();
    } else {
      // No user is logged in, so there are no clients to show
      setClients([]);
      setIsLoading(false);
    }
  }, [user, authLoading, toast]);

  const handleDeleteClient = async (clientId: string) => {
    try {
      await deleteDoc(doc(db, 'clients', clientId));
      toast({
        title: 'Success',
        description: 'Client deleted successfully.',
      });
    } catch (error) {
      console.error('Error deleting client:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to delete client.',
      });
    }
  };
  
  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  }

  const openNewDialog = () => {
    setEditingClient(null);
    setIsDialogOpen(true);
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Your Clients</CardTitle>
          <Button onClick={openNewDialog}>
            <PlusCircle className="mr-2" />
            Add Client
          </Button>
        </CardHeader>
        <CardContent>
          {isLoading ? (
             <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </div>
          ) : clients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Email</TableHead>
                  <TableHead className="hidden md:table-cell">Country</TableHead>
                  <TableHead className="w-[50px]"><span className="sr-only">Actions</span></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell>{client.name}</TableCell>
                    <TableCell className="hidden sm:table-cell">{client.email}</TableCell>
                    <TableCell className="hidden md:table-cell">{client.country}</TableCell>
                    <TableCell>
                      <AlertDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreHorizontal />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => openEditDialog(client)}>
                                <Edit className="mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <AlertDialogTrigger asChild>
                                  <DropdownMenuItem className="text-destructive">
                                      <Trash2 className="mr-2" />
                                      Delete
                                  </DropdownMenuItem>
                              </AlertDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                           <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete your client
                                and all associated data.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteClient(client.id)}>
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
          ) : (
            <div className="text-center py-12 text-muted-foreground">
              <p>No clients found.</p>
              <p>Click "Add Client" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingClient ? 'Edit Client' : 'Add New Client'}</DialogTitle>
            <DialogDescription>
              {editingClient ? 'Update the client details below.' : 'Fill in the details for your new client.'}
            </DialogDescription>
          </DialogHeader>
          <ClientForm 
            client={editingClient}
            onSuccess={() => setIsDialogOpen(false)} 
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
