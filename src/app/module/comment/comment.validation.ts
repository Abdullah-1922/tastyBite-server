import { z } from "zod";

const createCommentValidation = z.object({
  body: z.object({
    clerkId: z.string().min(1, "clerkId is required"),
    tourPackageId: z.string().min(1, "Tour Package ID is required"),
    title: z.string({ required_error: "Title is required" }),
    comment: z.string().min(1, "Comment is required"),
    images: z.array(z.string()).optional(),
  }),
});
export const CommentValidation = {
  createCommentValidation,
};
