/* eslint-disable @typescript-eslint/no-unused-vars */

import express, { NextFunction, Request, Response } from "express";
import validateRequest from "../../middlewares/validateRequest";

import { UserControllers } from "./user.controller";
import { UserValidation } from "./user.validation";

const router = express.Router();

router.post(
  "/",
  validateRequest(UserValidation.CreateUserValidationSchema),
  UserControllers.createUser,
);

router.get("/", UserControllers.getAllUser);
router.get("/stats/monthly-users", UserControllers.monthlyUserCount);
router.delete("/:id", UserControllers.deleteUser);
router.patch("/update-profile",validateRequest(UserValidation.updateUserValidationSchema), UserControllers.updateUser);
router.patch("/update-role/:id", UserControllers.updateUserRole);
router.get("/stripe-user/:id", UserControllers.getStripeUser);
router.post("/stripe-user", UserControllers.createStripeUser);
router.get("/:id", UserControllers.getSingleUser);

export const UserRoutes = router;
