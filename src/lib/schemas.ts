import { z } from "zod";

export const clientSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Invalid email address."),
  address: z.string().min(10, "Please enter a full address."),
  country: z.string().min(2, "Country is required."),
  vatId: z.string().optional(),
});
export type ClientFormValues = z.infer<typeof clientSchema>;

export const productSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  description: z.string().optional(),
  unitPrice: z.coerce.number().min(0, "Unit price cannot be negative."),
  taxRate: z.coerce.number().min(0).max(100).optional(),
});
export type ProductFormValues = z.infer<typeof productSchema>;


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
