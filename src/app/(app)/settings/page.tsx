import { Card, CardHeader, CardTitle } from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
       <Card className="flex items-center justify-center min-h-[400px]">
          <CardHeader>
              <CardTitle className="text-center text-muted-foreground">Settings page coming soon!</CardTitle>
          </CardHeader>
      </Card>
    </div>
  );
}
