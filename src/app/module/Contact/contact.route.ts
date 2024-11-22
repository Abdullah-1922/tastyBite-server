import { Router } from "express";
import { ContactController } from "./contact.controller";
import validateRequest from "../../middlewares/validateRequest";
import { ContactValidation } from "./contact.validation";

const router = Router();

router.post(
  "/",
  validateRequest(ContactValidation.CreateContactValidationSchema),
  ContactController.createContact
);

router.get("/", ContactController.getAllContacts);

router.delete("/:contactId", ContactController.deleteContactById);

export const ContactRoutes = router;
