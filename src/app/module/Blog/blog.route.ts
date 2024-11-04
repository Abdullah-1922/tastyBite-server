import { Router } from "express";

import { BlogControllers } from "./blog.controller";
import validateRequest from "../../middlewares/validateRequest";
import { BlogValidation } from "./blog.validation";

const router = Router();

router.post(
  "/",
  validateRequest(BlogValidation.BlogValidationSchema),
  BlogControllers.createBlog,
);
router.get("/", BlogControllers.getAllBlog);
router.delete("/:blogId", BlogControllers.deleteBlogWithId);
router.get("/:blogId", BlogControllers.getSingleBlog);
router.patch("/:blogId", BlogControllers.updateBlog);

export const BlogRouter = router;
