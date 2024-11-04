import { z } from "zod";

const createFeedBackValidation = z.object({
  body: z.object({
    feedback: z.string().nonempty("Feedback is required"),
    name: z.string().nonempty("Name is required"),
    image: z.string().optional(),
    email: z.string().email("Invalid email").nonempty("Email is required"),
  }),
});
export const feedbackValidation = {
  createFeedBackValidation,
};
