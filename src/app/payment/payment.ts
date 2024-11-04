// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { Request, Response } from 'express';
// import Stripe from 'stripe';
// import { Package } from '../module/tourPackage/package.model';
// import AppError from '../errors/AppError';
// import { User } from '../module/User/user.model';
// import catchAsync from '../utils/catchAsync';

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

// interface CreateCheckoutSessionRequest extends Request {
//   body: {
//     packageId: string;
//     clerkId: string;
//   };
// }

// export const paymentController = catchAsync(async (req: CreateCheckoutSessionRequest, res: Response) => {
//   const { packageId, clerkId } = req.body;

//   // Fetch package data
//   const packageData = await Package.findById(packageId).select('price');
//   if (!packageData) {
//     throw new AppError(404, 'Package not found');
//   }

//   // Fetch user data
//   const user = await User.findOne({ clerkId });
//   console.log(user);
//   if (!user) {
//     throw new AppError(404, 'User not found');
//   }

//   const price = packageData.price * 100; // Price in cents

//   try {
//     // Create Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: 'Tour Package',
//             },
//             unit_amount: price,
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'payment',
//       success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/success`,
//       cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/cancel`,
//       metadata: {
//         clerkId,
//         packageId,
//       },
//     });

//     res.json({ sessionId: session.id });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// }
// )