// src/ai/flows/invoice-autofill.ts
'use server';

/**
 * @fileOverview Invoice autofill AI agent.
 *
 * - invoiceAutofill - A function that suggests invoice details based on existing data.
 * - InvoiceAutofillInput - The input type for the invoiceAutofill function.
 * - InvoiceAutofillOutput - The return type for the invoiceAutofill function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InvoiceAutofillInputSchema = z.object({
  clientId: z.string().describe('The ID of the client for whom the invoice is being created.'),
  invoiceItems: z.array(
    z.object({
      description: z.string().describe('Description of the item.'),
      quantity: z.number().describe('Quantity of the item.'),
      unitPrice: z.number().describe('Unit price of the item.'),
    })
  ).optional().describe('Existing invoice items, if any.'),
  currency: z.string().describe('The currency of the invoice (e.g., EUR, USD, GBP).'),
  userId: z.string().describe('The ID of the user creating the invoice.'),
});
export type InvoiceAutofillInput = z.infer<typeof InvoiceAutofillInputSchema>;

const InvoiceAutofillOutputSchema = z.object({
  suggestedItems: z.array(
    z.object({
      description: z.string().describe('Suggested description of the item.'),
      quantity: z.number().describe('Suggested quantity of the item.'),
      unitPrice: z.number().describe('Suggested unit price of the item.'),
    })
  ).describe('Suggested invoice items based on historical data.'),
  suggestedNote: z.string().describe('A suggested note for the invoice.'),
});
export type InvoiceAutofillOutput = z.infer<typeof InvoiceAutofillOutputSchema>;

export async function invoiceAutofill(input: InvoiceAutofillInput): Promise<InvoiceAutofillOutput> {
  return invoiceAutofillFlow(input);
}

const prompt = ai.definePrompt({
  name: 'invoiceAutofillPrompt',
  input: {schema: InvoiceAutofillInputSchema},
  output: {schema: InvoiceAutofillOutputSchema},
  prompt: `You are an AI assistant specialized in suggesting invoice details based on historical data.

  Given the client ID, existing invoice items (if any), currency, and user ID, suggest invoice items and a note that are likely to be applicable.

  Client ID: {{{clientId}}}
  Existing Invoice Items: {{#each invoiceItems}}{{{this.description}}} (Quantity: {{{this.quantity}}}, Unit Price: {{{this.unitPrice}}}){{/each}}
  Currency: {{{currency}}}
  User ID: {{{userId}}}

  Please provide the suggested invoice items and a note, considering the provided information. Focus on accuracy and relevance.
  Ensure the suggested items are in the same currency as the invoice.
  Do not suggest more than 5 items.
  Limit the note to 50 words.
  `,
});

const invoiceAutofillFlow = ai.defineFlow(
  {
    name: 'invoiceAutofillFlow',
    inputSchema: InvoiceAutofillInputSchema,
    outputSchema: InvoiceAutofillOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
