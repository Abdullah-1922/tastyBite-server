import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { Menu } from "../menu/menu.model";
// import { User } from "../User/user.model";
import { TFood } from "./food.interface";
import { Food } from "./food.model";

const createFood = async (payload: Partial<TFood>) => {
  const menu = await Menu.findById(payload.menuId);

  if (!menu) {
    throw new AppError(404, "Menu not found");
  }
  const res = await Food.create(payload);
if(res){
  await Menu.findByIdAndUpdate(payload.menuId, { $push: { foods: res._id } });
}

  return res;
};
const getAllFood = async (query: Record<string, unknown>) => {
  const FoodQuery = new QueryBuilder(Food.find().populate(['menuId']), query)
    .search(["FoodCategory", "title", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await FoodQuery.modelQuery;
  return result;
};

const deleteSingleFood = async (id: string) => {
  const food = await Food.findById(id);
  if (!food) {
    throw new AppError(404, "Food id Invalid");
  }
  const result = await Food.findByIdAndDelete(id);

  return result;
};
const getSingleFood = async (id: string) => {
  const result = await Food.findById(id);

  return result;
};
const updateFood = async (id: string, payload: Partial<TFood>) => {
  const food = await Food.findById(id);
  if (!food) {
    throw new AppError(404, "Food id Invalid");
  }
  const result = await Food.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const FoodServices = {
  createFood,
  getAllFood,
  deleteSingleFood,
  getSingleFood,
  updateFood,
};
