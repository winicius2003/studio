import LandingHeader from '@/components/landing/header';
import PricingPage from '@/components/pricing-page';
import LandingFooter from '@/components/landing/footer';

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <LandingHeader />
      <main className="flex-1">
        <PricingPage />
      </main>
      <LandingFooter />
    </div>
  );
}
