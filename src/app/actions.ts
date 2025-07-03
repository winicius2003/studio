// src/app/actions.ts
'use server';

import { invoiceAutofill } from '@/ai/flows/invoice-autofill';
import type { InvoiceAutofillInput } from '@/ai/flows/invoice-autofill';

export async function getAutofillSuggestions(input: InvoiceAutofillInput) {
  try {
    // In a real app, you would add more complex logic here,
    // like retrieving historical data for the user and client.
    const result = await invoiceAutofill(input);
    return { success: true, data: result };
  } catch (error) {
    console.error('AI autofill error:', error);
    return { success: false, error: 'Failed to get AI suggestions.' };
  }
}
