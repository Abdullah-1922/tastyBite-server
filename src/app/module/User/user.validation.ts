import { z } from "zod";

const CreateUserValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }).min(2).max(255),
    clerkId: z.string({ required_error: "clerkId is required" }),
    email: z.string({ invalid_type_error: "Invalid type" }).email().optional(),
    image: z.string({ invalid_type_error: "Invalid type" }).optional(),
    location: z.array(z.string()).optional(),
    phone: z.string({ required_error: "Phone is required" }),
  }),
});
const updateUserValidationSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: "Name is required" })
      .min(2)
      .max(255)
      .optional(),
    clerkId: z.string({ required_error: "clerkId is required" }),
    email: z.string({ invalid_type_error: "Invalid type" }).email().optional(),
    image: z.string({ invalid_type_error: "Invalid type" }).optional(),
    location: z.array(z.string()).optional(),
    phone: z.string({ required_error: "Phone is required" }).optional(),
    role: z.enum(["authority", "user", "deliveryBoy", "manager", "cashier"]).optional(),
    
  }),
});

export const UserValidation = {
  CreateUserValidationSchema,
  updateUserValidationSchema,
};
