import { z } from "zod";

// Rules of a delivery address. The messages are the ones the user sees.
export const addressSchema = z.object({
  fullName: z.string().trim().min(1, "El nombre completo es obligatorio"),
  phone: z.string().trim().min(1, "El teléfono es obligatorio"),
  street: z.string().trim().min(1, "La calle es obligatoria"),
  city: z.string().trim().min(1, "La ciudad es obligatoria"),
  province: z.string().trim().optional(),
  // Text, not a number: "01234" must keep its leading zero
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{5}$/, "El código postal debe tener 5 cifras"),
  country: z.string().min(1, "El país es obligatorio"),
});

export type Address = z.infer<typeof addressSchema>;
