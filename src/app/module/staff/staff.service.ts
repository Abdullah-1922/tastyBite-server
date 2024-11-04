/* eslint-disable @typescript-eslint/no-explicit-any */
import { QueryBuilder } from "../../builder/QueryBuilder";
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
    .search(["name", "email", "staff"])
    .paginate();

  const staff = await staffQuery.modelQuery;

  const meta = await staffQuery.countTotal();

  return { staff, meta };
};

export const StaffService = {
  createStaff,
  getAllStaff,
};
