import { Router } from "express";
import { CommentControllers } from "./comment.controller";
import validateRequest from "../../middlewares/validateRequest";
import { CommentValidation } from "./comment.validation";

const route = Router();

route.post(
  "/",
  validateRequest(CommentValidation.createCommentValidation),
  CommentControllers.createComment
);

route.get("/:id", CommentControllers.getCommentForFood);

export const CommentRoutes = route;
