import { model, Schema } from "mongoose";
import { TMenu } from "./menu.interface";

const menuSchema = new Schema<TMenu>({
  name: { type: String, required: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
  foods: [{ type: Schema.Types.ObjectId, ref: "Food" }],
});

export const Menu = model("Menu", menuSchema);
