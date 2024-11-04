import { z } from "zod";

const createMenuValidationSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Name is required",
      invalid_type_error: "Name should be string",
    }),
    image: z.string({
      required_error: "Image is required",
      invalid_type_error: "Image should be string",
    }),
    description: z.string({
      required_error: "MenuDescription is required",
      invalid_type_error: "MenuDescription should be string",
    }),
  }),
});

export const MenuValidation = {
  createMenuValidationSchema,
};
