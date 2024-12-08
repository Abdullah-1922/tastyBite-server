import { Router } from "express";

import { DeliveryLocationController } from "./deliveryLocation.controller";

const route =Router();

route.post("/", DeliveryLocationController.createDeliveryLocation);
route.get("/", DeliveryLocationController.getAllDeliveryLocations);
route.get("/user/:userId", DeliveryLocationController.getAllDeliveryLocationsByUser);
route.put("/:id", DeliveryLocationController.updateDeliveryLocation);
route.delete("/:id", DeliveryLocationController.deleteDeliveryLocationById);

export const DeliveryLocationRoutes = route;