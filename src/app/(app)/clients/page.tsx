import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
      <Card className="flex items-center justify-center min-h-[400px]">
          <CardHeader>
              <CardTitle className="text-center text-muted-foreground">Client management coming soon!</CardTitle>
          </CardHeader>
      </Card>
    </div>
  );
}
