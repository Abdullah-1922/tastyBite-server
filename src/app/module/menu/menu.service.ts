/* eslint-disable @typescript-eslint/no-unused-vars */
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

const getAllMenu = async () => {
  const res = await Menu.find();
  return res;
};

const getSingleMenu = async (menuId: string) => {
  const res = await Menu.findById(menuId);
  return res;
};
const updateMenu = async (
  menuId: string,
  payload: Partial<TMenu>,
) => {
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
};
