import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, Request, Response } from "express";
import router from "./app/routes";
import notFound from "./app/middlewares/notFound";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
// import rateLimit from "express-rate-limit";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";
// import paymentWebhookHandler from "./app/payment/payment-web-hook";
// import { paymentController } from "./app/payment/payment";
import Stripe from "stripe";

const app: Application = express();

// Parsers
app.use(express.json());
app.use(cookieParser());

app.use(
  cors({
    origin: [
      "http://localhost:3001",
      "http://localhost:3000",
      "https://tasty-bite-website.vercel.app",
    ],
    credentials: true,
  })
);
// app.use(cors({origin:"*",credentials:true}))
// const limiter = rateLimit({
//   max: 10000,
//   windowMs: 60 * 1000,
//   message: "Too many requests from this IP, please try again after one minute.",
//   handler: (req, res, next, options) => {
//     res.status(429).json({
//       error: "Too Many Requests",
//       message: options.message,
//     });
//   },
// });
// app.use("/api/v1", limiter);

// Clerk authentication
app.use(ClerkExpressWithAuth());
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2024-06-20",
  typescript: true,
});
// Main Routes

app.use("/api/v1", router);

// Payment-related Routes
// app.post("/api/v1/create-checkout-session", paymentController);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello from TastyBite");
});

// Error handlers
app.use(globalErrorHandler);
app.use(notFound);

export default app;
