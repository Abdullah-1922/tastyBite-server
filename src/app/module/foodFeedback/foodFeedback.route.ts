import { Router } from "express";
import { FoodFeedbackControllers } from "./foodFeedback.controller";
import validateRequest from "../../middlewares/validateRequest";
import { FoodFeedbackValidation } from "./foodFeedback.validation";

const router = Router();

router.post(
  "/",
  validateRequest(FoodFeedbackValidation.FoodFeedbackValidationSchema),
  FoodFeedbackControllers.createFeedback
);

router.get("/", FoodFeedbackControllers.getAllFeedback);
router.get("/:foodId", FoodFeedbackControllers.getAllFeedbackByFoodId);

router.patch(
  "/:feedbackId",
  validateRequest(FoodFeedbackValidation.FoodFeedbackUpdateSchema),
  FoodFeedbackControllers.updateFeedback
);

router.delete("/:feedbackId", FoodFeedbackControllers.deleteFeedback);

export const FoodFeedbackRouters = router;
