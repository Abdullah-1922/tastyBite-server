import { Router } from "express";
import { MenuControllers } from "./menu.controller";
import { MenuValidation } from "./menu.validation";
import validateRequest from "../../middlewares/validateRequest";

const route = Router();

route.post(
  "/",
  validateRequest(MenuValidation.createMenuValidationSchema),
  MenuControllers.createMenu
);
route.get("/", MenuControllers.getAllMenu);
route.get("/:id", MenuControllers.getSingleMenu);
route.patch("/:id", MenuControllers.updateMenu);
route.delete("/:id", MenuControllers.deleteMenu);

export const MenuRoutes = route;
