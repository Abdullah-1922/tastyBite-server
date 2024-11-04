import { Types } from "mongoose";

export interface TMenu {
  name: string;
  image: string;
  description: string;
  foods:Types.ObjectId[];
}
