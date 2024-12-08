import { z } from 'zod';

const CreateDeliveryLocationValidation = z.object({
   body:z.object({
    user: z.string().nonempty("User is required"),
    country: z.string().nonempty("Country is required"),
    latitude: z.number().nonnegative("Latitude is required"),
    longitude: z.number().nonnegative("Longitude is required"),
    name: z.string().nonempty("Name is required"),
    place: z.string().nonempty("Place is required"),
    postcode: z.string().optional(),
    region: z.string().nonempty("Region is required"),
    streetAndNumber: z.string().nonempty("Street and Number are required"),
   })
});
const UpdateDeliveryLocationValidation = z.object({
   body: z.object({
    user: z.string().optional(),
    country: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    name: z.string().optional(),
    place: z.string().optional(),
    postcode: z.string().optional(),
    region: z.string().optional(),
    streetAndNumber: z.string().optional(),
   })
});

export const DeliveryLocationValidation = {
    CreateDeliveryLocationValidation,
    UpdateDeliveryLocationValidation
    };