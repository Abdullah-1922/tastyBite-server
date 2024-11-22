import httpStatus from "http-status";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ContactService } from "./contact.service";


const createContact = catchAsync(async (req, res) => {
  const result = await ContactService.createContact(req.body);
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Contact form submitted successfully",
    data: result,
  });
});

const getAllContacts = catchAsync(async (req, res) => {
  const { result, meta } = await ContactService.getAllContacts(req.query);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contacts retrieved successfully",
    data: result,
    meta,
  });
});

const deleteContactById = catchAsync(async (req, res) => {
  const contactId = req.params.contactId;
  await ContactService.deleteContactById(contactId);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Contact deleted successfully",
    data: null,
  });
});

export const ContactController = {
  createContact,
  getAllContacts,
  deleteContactById,
};
