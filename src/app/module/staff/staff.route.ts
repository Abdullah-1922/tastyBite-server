import { Router } from "express";
import { StaffController } from "./staff.controller";
import validateRequest from "../../middlewares/validateRequest";
import { StaffValidation } from "./staff.validation";

const route = Router();

route.post(
  "/",
  validateRequest(StaffValidation.createStaffValidation),
  StaffController.createStaff
);
route.get("/", StaffController.getAllStaff);

export const StaffRoutes = route;
