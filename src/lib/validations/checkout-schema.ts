
import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Full name must be at least 3 characters.")
    .max(50, "Full name cannot exceed 50 characters."),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Enter a valid email address."),

  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone number must contain exactly 10 digits."),

  streetAddress: z.string().trim().min(1, "Street address is required."),

  apartment: z.string(),

  city: z.string().min(1, "Please select a city."),
  state: z.string().min(1, "Please select a state."),

  zip: z.string().regex(/^\d{5,6}$/, "ZIP code must contain 5 or 6 digits."),

  country: z.string().min(1, "Please select a country."),
});

export type CheckoutSchemaInput = z.input<typeof checkoutSchema>;
export type CheckoutSchemaOutput = z.output<typeof checkoutSchema>;
