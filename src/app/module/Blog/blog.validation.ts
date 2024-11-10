import { z } from "zod";
import { BlogCategoryNames } from "./blog.constant";


const BlogValidationSchema = z.object({
  body: z.object({
    clerkId: z.string({ required_error: "User Id is required" }).min(2).max(255),
    blogCategory: z.enum(BlogCategoryNames as [string, ...string[]]),
    title: z.string({ required_error: "Title is required" }),
    description: z.string({ invalid_type_error: "Description is required" }),
    image: z.string({ invalid_type_error: "Invalid type" }),
  }),
});

export const BlogValidation = {
  BlogValidationSchema,
};
