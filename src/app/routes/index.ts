import { Router } from "express";
import { UserRoutes } from "../module/User/user.route";
import { BlogRouter } from "../module/Blog/blog.route";
import { CommentRoutes } from "../module/comment/comment.route";

import { FeedbackRoutes } from "../module/feedback/feedback.route";
import { MenuRoutes } from "../module/menu/menu.route";
import { FoodRouters } from "../module/Food/food.route";
import { StaffRoutes } from "../module/staff/staff.route";
import { BlogCommentRoutes } from "../module/Blog comment/comment.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/users",
    route: UserRoutes,
  },

  {
    path: "/blog",
    route: BlogRouter,
  },
  {
    path: "/menu",
    route: MenuRoutes,
  },
  {
    path: "/food",
    route: FoodRouters,
  },
  {
    path: "/comment",
    route: CommentRoutes,
  },

  {
    path: "/feedback",
    route: FeedbackRoutes,
  },
  {
    path: "/blog-comment",
    route: BlogCommentRoutes,
  },
  {
    path: "/staff",
    route: StaffRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));
export default router;
