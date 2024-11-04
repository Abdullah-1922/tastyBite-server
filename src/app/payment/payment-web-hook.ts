// /* eslint-disable @typescript-eslint/no-explicit-any */
// import Stripe from "stripe";
// import bodyParser from "body-parser";
// import express from "express";
// import Booking from "../module/Booking/booking.model";

// const router = express.Router();
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// });

// router.post(
//   "/payment-webhook",
//   bodyParser.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"]!;

//     try {
//       const event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET!
//       );

//       if (event.type === "checkout.session.completed") {
//         const session = event.data.object as Stripe.Checkout.Session;

//         // Save payment data to MongoDB
//         await Booking.create({
//           clerkId: session.metadata?.clerkId,
//           packageId: session.metadata?.packageId,
//           amount: session.amount_total,
//           paymentStatus: "Paid",
//           stripeSessionId: session.id,
//         });

//         res.json({ received: true });
//       } else {
//         res.status(400).send(`Unhandled event type ${event.type}`);
//       }
//     } catch (err: any) {
//       console.error(`Webhook Error: ${err.message}`);
//       res.status(400).send(`Webhook Error: ${err.message}`);
//     }
//   }
// );

// export default router;


// import express from "express";
// import bodyParser from "body-parser";
// import Stripe from "stripe";
// import Booking from "../module/Booking/booking.model";

// const app = express();

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-06-20",
// });

// // Add the webhook route before any middleware that might parse the request body
// app.use(
//   "/payment-webhook",
//   bodyParser.raw({ type: "application/json" }),
//   async (req, res) => {
//     const sig = req.headers["stripe-signature"]!;

//     try {
//       const event = stripe.webhooks.constructEvent(
//         req.body,
//         sig,
//         process.env.STRIPE_WEBHOOK_SECRET!
//       );

//       if (event.type === "checkout.session.completed") {
//         const session = event.data.object as Stripe.Checkout.Session;

//         // Save payment data to MongoDB
//         await Booking.create({
//           clerkId: session.metadata?.clerkId,
//           packageId: session.metadata?.packageId,
//           amount: session.amount_total,
//           paymentStatus: "Paid",
//           stripeSessionId: session.id,
//         });

//         res.json({ received: true });
//       } else {
//         res.status(400).send(`Unhandled event type ${event.type}`);
//       }
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     } catch (err: any) {
//       console.error(`Webhook Error: ${err.message}`);
//       res.status(400).send(`Webhook Error: ${err.message}`);
//     }
//   }
// );

// // Register other middleware after the webhook route
// app.use(bodyParser.json());
// // Other routes...

// export default app;
