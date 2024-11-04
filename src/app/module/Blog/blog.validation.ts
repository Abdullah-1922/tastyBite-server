import { z } from "zod";


const BlogValidationSchema = z.object({
  body: z.object({
    clerkId: z.string({ required_error: "User Id is required" }).min(2).max(255),
    newsCategory: z.enum(["Adventure Travel", "Beach", "Explore World", "Family Holidays", "Art and culture", "Hill Travel"]),
    title: z.string({ required_error: "Title is required" }),
    description: z.string({ invalid_type_error: "Description is required" }),
    images: z.string({ invalid_type_error: "Invalid type" }),
  }),
});

export const BlogValidation = {
  BlogValidationSchema,
};
