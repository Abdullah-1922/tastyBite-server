import { Router } from "express";

import { FoodControllers } from "./food.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FoodValidation } from "./food.validation";

const router = Router();

router.post(
  "/",
  validateRequest(FoodValidation.FoodValidationSchema),
  FoodControllers.createFood
);
router.get("/", FoodControllers.getAllFood);
router.post("/foodByIds", FoodControllers.getFoodsByIds);
router.delete("/:foodId", FoodControllers.deleteFoodWithId);
router.get("/:foodId", FoodControllers.getSingleFood);
router.patch("/:foodId", FoodControllers.updateFood);

export const FoodRouters = router;
