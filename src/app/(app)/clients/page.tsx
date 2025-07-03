import ClientManagement from '@/components/clients/client-management';

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <p className="text-muted-foreground">
          Manage your clients and their information here.
        </p>
      </div>
      <ClientManagement />
    </div>
  );
}
