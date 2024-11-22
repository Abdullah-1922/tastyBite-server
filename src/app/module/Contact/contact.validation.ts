import { z } from "zod";

const CreateContactValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string({ required_error: "First name is required" })
      .min(1, "First name cannot be empty"),
    lastName: z
      .string({ required_error: "Last name is required" })
      .min(1, "Last name cannot be empty"),
    email: z
      .string({ required_error: "Email is required" })
      .email("Invalid email address"),
    phone: z
      .string({ required_error: "Phone number is required" })
      .regex(/^\d+$/, "Phone number must contain only digits")
      .min(11, "Phone number must be at least 11 digits"),
    message: z
      .string({ required_error: "Message is required" })
      .min(1, "Message cannot be empty"),
  }),
});

export const ContactValidation = {
  CreateContactValidationSchema,
};
