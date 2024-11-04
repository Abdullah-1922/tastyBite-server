import { NextFunction, Request, Response } from "express";
import AppError from "../errors/AppError";
import httpStatus from "http-status";
import { User } from "../module/User/user.model";
import catchAsync from "../utils/catchAsync";

const auth = () => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const clerkId = req.headers["clerkid"];

    if (!clerkId) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
    }
    const user = await User.findOne({ clerkId });
    if (!user) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
    }

    next();
  });
};

export default auth;
