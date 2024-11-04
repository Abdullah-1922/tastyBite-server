import { Router } from "express";
import { FeedbackController } from "./feedback.controller";
import validateRequest from "../../middlewares/validateRequest";
import { feedbackValidation } from "./feedback.validation";

const route = Router();

route.post("/", validateRequest(feedbackValidation.createFeedBackValidation) ,FeedbackController.createFeedback)
route.get("/", FeedbackController.getAllFeedback)


export  const FeedbackRoutes = route;