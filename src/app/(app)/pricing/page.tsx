import PricingPage from '@/components/pricing-page';

export default function AppPricingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upgrade Your Plan</h1>
        <p className="text-muted-foreground">
          Choose a plan that fits your needs and unlock powerful features.
        </p>
      </div>
      <PricingPage />
    </div>
  );
}
