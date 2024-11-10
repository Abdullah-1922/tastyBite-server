/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { TStaff } from "./staff.interface";
import { Staff } from "./staff.model";

const createStaff = async (staff: TStaff) => {
  const newStaff = await Staff.create(staff);
  return newStaff;
};

const getAllStaff = async (query: any) => {
  const staffQuery = new QueryBuilder(Staff.find(), query)
    .filter()
    .sort()
    .fields()
    .search(["name", "email", "designation"])
    .paginate();

  const staff = await staffQuery.modelQuery;

  const meta = await staffQuery.countTotal();

  return { staff, meta };
};
const getSingleStaff = async (id: string) => {
  const staff = await Staff.findById(id);
  return staff;
};
const updateStaff = async (id: string, payload: Partial<TStaff>) => {
  const staff = await Staff.findById(id);
  if (!staff) {
    throw new AppError(404, "Staff not found");
  }
  const updatedStaff = await Staff.findByIdAndUpdate(id, payload, { new: true });
  return updatedStaff;
};
const deleteStaff = async (id: string) => {
  const staff = await Staff.findByIdAndDelete(id);
  return staff;
};
export const StaffService = {
  createStaff,
  getAllStaff,

  getSingleStaff,
  updateStaff,
  deleteStaff,
};
