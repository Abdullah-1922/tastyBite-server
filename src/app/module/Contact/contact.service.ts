/* eslint-disable @typescript-eslint/no-explicit-any */

import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Contact } from "./contact.model";

const createContact = async (payload: any) => {
  const contact = await Contact.create(payload);
  return contact;
};

const getAllContacts = async (query: any) => {
  const contactQuery = new QueryBuilder(Contact.find(), query)
    .search(["firstName", "lastName", "email", "message"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await contactQuery.modelQuery;
  const meta = await contactQuery.countTotal();
  return { result, meta };
};

const deleteContactById = async (contactId: string) => {
  const result = await Contact.findByIdAndDelete(contactId);
  if (!result) {
    throw new AppError(404,"Contact not found");
  }
};

export const ContactService = {
  createContact,
  getAllContacts,
  deleteContactById,
};
