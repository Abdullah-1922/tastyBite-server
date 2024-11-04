import { z } from "zod";

const createStaffValidation = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required"),
    image: z.string().optional(),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    phoneNo: z.string().nonempty("Phone number is required"),
    designation: z.string().nonempty("Designation is required"),
    address: z.string().nonempty("Address is required"),
    socialLink: z
      .array(
        z.object({
          provider: z.enum(["facebook", "twitter", "linkedin", "instagram"]),
          link: z.string().nonempty("Link is required"),
        })
      )
      .nonempty("At least one social link is required"),
  }),
});
export const StaffValidation = {
  createStaffValidation,
};
