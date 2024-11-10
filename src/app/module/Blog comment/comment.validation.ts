import { z } from "zod";

const createCommentValidation = z.object({
  body: z.object({
    clerkId: z.string().min(1, "clerkId is required"),
    blogId: z.string().min(1, "Blog ID is required"),
   
    comment: z.string().min(1, "Comment is required"),
    images: z.array(z.string()).optional(),
  }),
});
export const CommentValidation = {
  createCommentValidation,
};
