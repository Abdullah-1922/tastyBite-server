/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Food } from "../Food/food.model";
// import { Package } from "../tourPackage/package.model";
import { TMenu } from "./menu.interface";
import { Menu } from "./menu.model";

const createMenu = async (payload: TMenu) => {
  const res = await Menu.create(payload);
  return res;
};

const deleteMenu = async (menuId: string) => {
  const menu = await Menu.findById(menuId);
  if (!menu) {
    throw new AppError(404, "Menu not found");
  }

  await Food.deleteMany({ menuId: menuId });

  //  delete the menu itself
  const res = await Menu.findByIdAndDelete(menuId);
  // return res;
};

const getAllMenu = async (query: any) => {
  const menuQuery = new QueryBuilder(Menu.find(), query)
    .filter()
    .sort()
    .paginate()
    .fields();
  const result = await menuQuery.modelQuery;
  const meta = await menuQuery.countTotal();

  return { result, meta };
};

const getSingleMenu = async (menuId: string) => {
  const res = await Menu.findById(menuId);
  return res;
};
const getFoodByMenu = async (menuId: string,query:any) => {
 
  const menuQuery = new QueryBuilder(Food.find({menuId:menuId}), query)
  .filter()
  .sort()
  .paginate()
  .fields();
const result = await menuQuery.modelQuery;
const meta = await menuQuery.countTotal();

return { result, meta };
};
const updateMenu = async (menuId: string, payload: Partial<TMenu>) => {
  const menu = await Menu.findById(menuId);
  if (!menu) {
    throw new AppError(404, "Menu not found");
  }

  const res = await Menu.findByIdAndUpdate(menuId, payload, {
    new: true,
  });
  return res;
};

export const MenuServices = {
  createMenu,
  deleteMenu,
  getAllMenu,
  getSingleMenu,
  updateMenu,
  getFoodByMenu,
};
