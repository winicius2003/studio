'use client';

import { useState } from 'react';
import { Check, ArrowRight, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const plans = [
  {
    name: 'Free',
    price: { monthly: 0, yearly: 0 },
    description: "Yes, it's really free :)",
    cta: 'Get started',
    link: '/signup',
    features: [
      'Up to 5 clients',
      'Unlimited invoices',
      '4 professional invoice templates',
      'Add your logo to PDFs',
      'Direct payment link',
      'Product and service library',
      'Basic Kanban for project organization',
      'Simple expense and vendor management',
      'Real-time PDF invoice generation',
      'Automatic tax calculation (per line or total)',
      'Client portal with history and payment',
      'Portal in English, Portuguese, or Spanish',
      'Automatic currency conversion',
      'Notifications when invoices are viewed/paid',
    ],
    highlight: false,
  },
  {
    name: 'Pro',
    price: { monthly: 9.99, yearly: 99 },
    description: 'Pay annually and get 2 months free!',
    cta: 'Subscribe now',
    link: '/signup?plan=pro',
    features: [
      'Everything in Free Plan +',
      'Unlimited clients',
      'Remove "Created with Invoiceo" branding',
      'Send emails via Gmail/MSN or custom SMTP',
      'Advanced invoice templates (11 models)',
      'Full invoice design customization',
      'External API integration (Zapier, Make, etc)',
      'Custom URLs (e.g., yourcompany.invoiceo.com)',
      'Automatic email reminders (pre & post due date)',
      'PDF automatically attached to emails',
      "Client's electronic signature on invoice",
      'Checkbox for terms approval',
      'Reports: invoices, revenue, expenses, P&L',
      'Bulk sending of invoices and quotes',
      'Client groups and custom rules',
      'Tax calculation by EU country (e.g., VAT Portugal/Spain)',
    ],
    highlight: true,
  },
  {
    name: 'Business',
    price: { monthly: 19.99, yearly: 199 },
    description: 'Ideal for small teams and advanced accounting.',
    cta: 'Subscribe now',
    link: '/signup?plan=business',
    features: [
      'Everything in Pro Plan +',
      'Up to 5 users (with role-based permissions)',
      'Client portal with your own domain (e.g., billing.yourcompany.com)',
      'Attach files to invoices (PDF, DOC, JPG etc)',
      'Advanced tax reports and CSV export',
      'Bank integration via OpenBanking (Revolut, N26, etc)',
      'Accounting integration (Xero, QuickBooks, Sage)',
      'UBL and European e-Invoicing format (PEPPOL*)',
      '250 PEPPOL credits included per year',
      'Notifications on Slack, Discord, or MS Teams',
    ],
    highlight: false,
  },
  {
    name: 'Enterprise+ Concierge',
    price: { custom: 'From €240/year' },
    description: 'Custom solutions for demanding businesses.',
    cta: "Let's talk!",
    link: 'mailto:enterprise@invoiceo.com',
    features: [
      'Everything in Business Plan +',
      'Priority support',
      'Technical concierge for onboarding',
      'Template design service',
      'Data migration support',
      'Custom-tailored reports',
      'Priority on the feature roadmap',
      'Early access to new features',
    ],
    highlight: false,
  },
];

const faqs = [
  {
    question: 'How do I cancel my plan?',
    answer:
      "You can cancel your plan at any time from your account settings. When you cancel, you'll be automatically downgraded to the Free plan at the end of your current billing cycle. You won't lose any of your data.",
  },
  {
    question: 'What are the limitations of the free plan?',
    answer:
      'The Free plan is very generous and suitable for most freelancers starting out. The main limitation is the cap of 5 active clients. You still get unlimited invoices and access to core features. The "Created with Invoiceo" branding will also be present on your invoices.',
  },
  {
    question: 'What is the difference between monthly and annual payment?',
    answer:
      "By choosing the annual payment option, you get a significant discount equivalent to two months free compared to paying monthly. It's a great way to save money if you plan to use Invoiceo for the long term. Both plans offer the exact same features.",
  },
   {
    question: 'Is my data secure?',
    answer:
      "Absolutely. We take security very seriously. All plans include SSL encryption to protect your data in transit. Our infrastructure is GDPR-ready, ensuring your data and your clients' data are handled according to the highest privacy standards.",
  },
];

export default function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);

  return (
    <div className="container py-12">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
          Simple, Powerful Invoicing for Europe
        </h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Focus on your work, not on paperwork. Choose a plan that grows with
          your business. All prices in EUR.
        </p>
      </div>

      <div className="mt-8 flex items-center justify-center space-x-4">
        <Label htmlFor="billing-cycle">Monthly</Label>
        <Switch
          id="billing-cycle"
          checked={isYearly}
          onCheckedChange={setIsYearly}
        />
        <Label htmlFor="billing-cycle" className="flex items-center">
          Yearly{' '}
          <span className="ml-2 rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">
            2 months free!
          </span>
        </Label>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        {plans.map((plan) => (
          <Card
            key={plan.name}
            className={cn('flex flex-col', plan.highlight && 'border-primary ring-2 ring-primary')}
          >
            <CardHeader>
              <CardTitle>{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 space-y-6">
                <div className="space-y-2">
                    <div className="text-4xl font-bold">
                        {plan.price.custom ? (
                            <span className="text-2xl">{plan.price.custom}</span>
                        ) : plan.name === 'Free' ? (
                            `€${plan.price.yearly}`
                        ) : (
                            `€${isYearly ? (plan.price.yearly / 12).toFixed(2) : plan.price.monthly}`
                        )}
                        <span className="text-lg font-normal text-muted-foreground">
                            {plan.name === 'Free'
                            ? '/year'
                            : '/mo'}
                        </span>
                    </div>
                    {plan.name !== 'Free' && plan.name !== 'Enterprise+ Concierge' && (
                    <p className="text-xs text-muted-foreground">
                        {isYearly
                        ? `Billed as €${plan.price.yearly} per year.`
                        : 'Billed monthly.'}
                    </p>
                    )}
                </div>

              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    {feature.startsWith('Everything') ? <Minus className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-primary" /> : <Check className="mr-2 mt-1 h-4 w-4 flex-shrink-0 text-primary" />}
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link href={plan.link}>
                  {plan.cta} <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mx-auto mt-24 max-w-4xl">
        <h2 className="text-center text-3xl font-bold">
          Frequently Asked Questions
        </h2>
        <Accordion type="single" collapsible className="mt-8 w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger>{faq.question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
       <div className="mt-16 text-center text-sm text-muted-foreground">
            <p>All plans include SSL security and are GDPR-ready. Payments are securely handled by Stripe.</p>
            <p>Instantly downgrade or upgrade at any time. We support automatic currency conversion.</p>
        </div>
    </div>
  );
}
