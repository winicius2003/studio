import { z } from "zod";

export const lineItemSchema = z.object({
  description: z.string().min(1, "Description is required."),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0."),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative."),
});

export const invoiceSchema = z.object({
  clientId: z.string().min(1, "Client is required."),
  issueDate: z.date({ required_error: "Issue date is required." }),
  dueDate: z.date({ required_error: "Due date is required." }),
  currency: z.enum(["EUR", "USD", "GBP"]),
  lineItems: z.array(lineItemSchema).min(1, "At least one line item is required."),
  note: z.string().optional(),
});

export type InvoiceFormValues = z.infer<typeof invoiceSchema>;
