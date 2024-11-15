import { z } from "zod";

const createCommentValidation = z.object({
  body: z.object({
    clerkId: z.string().min(1, "clerkId is required"),
    foodId: z.string().min(1, "Food ID is required"),
    title: z.string({ required_error: "Title is required" }),
    comment: z.string().min(1, "Comment is required"),
    images: z.array(z.string()).optional(),
  }),
});
export const CommentValidation = {
  createCommentValidation,
};
