import { z } from "zod";

const CreateOrderValidationSchema = z.object({
  body: z
    .object({
      clerkId: z.string({ required_error: "clerkId is required" }),
      foods: z
        .array(
          z.object({
            foodId: z.string({ required_error: "foodId is required" }),
            quantity: z
              .number({ required_error: "Quantity is required" })
              .min(1),
          })
        )
        .min(1, "At least one food item is required"),
      paymentStatus: z.enum(["Paid", "Refunded"], {
        required_error: "Payment status is required",
      }),
      orderStatus: z.enum(
        [
          "Order Placed",
          "Order Confirmed",
          "Cooking",
          "Out For Delivery",
          "Delivered",
          "PickedUp",
          "Cancelled",
        ],
        { required_error: "Order status is required" }
      ),
      deliveryLocation: z
        .string({ required_error: "Delivery location is required" })
        .min(3, "Delivery location must be at least 3 characters long"),
      totalPrice: z
        .number({ required_error: "Total price is required" })
        .positive(),
      transactionId: z.string().optional(),
      invoiceId: z.string().optional(),
      isCancelled: z.boolean().default(false),
      isCompleted: z.boolean().default(false),
      deliveryMan: z.string().optional(),
    })
    .strict(),
});

const UpdateOrderValidationSchema = z.object({
  body: z
    .object({
      orderStatus: z.enum(
        [
          "Order Placed",
          "Order Confirmed",
          "Cooking",
          "Out For Delivery",
          "Delivered",
          "PickedUp",
          "Cancelled",
        ],
        { required_error: "Order status is required" }
      ),
      isCancelled: z.boolean().optional(),
      isCompleted: z.boolean().optional(),
    })
    .strict(),
});

export const OrderValidation = {
  CreateOrderValidationSchema,
  UpdateOrderValidationSchema,
};
