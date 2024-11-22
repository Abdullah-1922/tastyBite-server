import { z } from "zod";

const FoodFeedbackValidationSchema = z.object({
  body: z.object({
    foodId: z.string({ required_error: "Food ID is required" }),
    title: z.string({ required_error: "Title is required" }),
    clerkId: z.string({ required_error: "Clerk ID is required" }),
    review: z.string({ required_error: "Review is required" }),
    rating: z
      .number({ required_error: "Rating is required" })
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5"),
  }),
});

const FoodFeedbackUpdateSchema = z.object({
  body: z.object({
    title: z.string().optional(),
    review: z.string().optional(),
    rating: z
      .number()
      .min(1, "Rating must be at least 1")
      .max(5, "Rating must be at most 5")
      .optional(),
  }),
});

export const FoodFeedbackValidation = {
  FoodFeedbackValidationSchema,
  FoodFeedbackUpdateSchema,
};
