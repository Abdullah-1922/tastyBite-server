import { z } from "zod";

const createStaffValidation = z.object({
  body: z.object({
    name: z.string().nonempty("Name is required"),
    image: z.string().optional(),
    email: z.string().email("Invalid email").nonempty("Email is required"),
    phoneNo: z.string().nonempty("Phone number is required"),
    designation: z.string().nonempty("Designation is required"),
    address: z.string().nonempty("Address is required"),
    facebookLink: z.string().optional(),
    bio: z.string().optional(),
    linkedinLink: z.string().optional(),
    instagramLink: z.string().optional(),
    youtubeLink: z.string().optional(),
  }),
});
export const StaffValidation = {
  createStaffValidation,
};
