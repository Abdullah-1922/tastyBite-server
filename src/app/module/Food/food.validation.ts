import { z } from "zod";

const FoodValidationSchema = z.object({
  body: z.object({
    name: z.string({ required_error: "Name is required" }),
    description: z.string({ required_error: "Description is required" }),
    images: z.array(z.string({ required_error: "Image is required" })),
    price: z.number({ required_error: "Price is required" }),
    menuId: z.string({ required_error: "Menu ID is required" }),
    sizes: z.array(
      z.object({
        size: z.string({ required_error: "Size is required" }),
        price: z.number({ required_error: "Price is required" }),
        description: z.string().optional(),
      })
    ),
    extras: z.array(
      z.object({
        name: z.string({ required_error: "Name is required" }),
        extra_price: z.number({ required_error: "Extra price is required" }),
      })
    ),
    orders: z.array(z.string()).optional(),
    comments: z.array(z.string()).optional(),
    rating: z.array(z.string()).optional(),
    averageRating: z.number().default(0),
    totalRating: z.number().default(0),
  }),
});

export const FoodValidation = {
  FoodValidationSchema,
};
