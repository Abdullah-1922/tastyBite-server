// src/routes/orderRoutes.ts
import express from "express";
import { OrderControllers } from "./order.controller";
import validateRequest from "../../middlewares/validateRequest";
import { OrderValidation } from "./order.validation";


const router = express.Router();

router.post("/", validateRequest(OrderValidation.CreateOrderValidationSchema),OrderControllers.createOrder);
router.get("/", OrderControllers.getAllOrders);
router.get("/:id", OrderControllers.getOrderById);
router.get("/user/:id", OrderControllers.getUserOrders);
router.get("/deliveryman/:id", OrderControllers.getDeliveryManOrders);
router.patch("/:id", OrderControllers.updateOrderStatus);
router.delete("/:id", OrderControllers.deleteOrder);
export const OrderRoutes = router;
