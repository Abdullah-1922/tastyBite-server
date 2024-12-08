import { QueryBuilder } from "../../builder/QueryBuilder";
import DeliveryLocation from "./deliveryLocation.model";
import { TDeliveryLocation } from "./deliveryLocation.interface";
import { User } from "../User/user.model";
import AppError from "../../errors/AppError";


/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * Retrieves all delivery locations associated with a specific user, based on the provided query parameters.
 *
 * @param userId - The unique identifier of the user (clerkId).
 * @param query - An object containing query parameters for searching, filtering, sorting, paginating, and selecting fields.
 * @returns An object containing the result array of delivery locations and meta information about the total count.
 * @throws {AppError} If the user is not found.
 */
const createDeliveryLocation = async (payload: TDeliveryLocation) => {
  const user = await User.findOne({ clerkId: payload.user });
  if (!user) throw new AppError(404, "User not found");
  payload.user = user._id;
  const deliveryLocation = await DeliveryLocation.create(payload);

  if (deliveryLocation) {
    await User.findByIdAndUpdate(user._id, {
      //add location to user
      $push: { location: deliveryLocation._id },
    });
  }
  return deliveryLocation;
};

const getAllDeliveryLocations = async (query: any) => {
  const deliveryLocationQuery = new QueryBuilder(
    DeliveryLocation.find({ isDeleted: false }),
    query
  )
    .search(["name", "place", "country", "region", "streetAndNumber"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await deliveryLocationQuery.modelQuery;
  const meta = await deliveryLocationQuery.countTotal();
  return { result, meta };
};

const getAllDeliveryLocationsByUser = async (userId: string, query: any) => {
  const user = await User.findOne({ clerkId: userId });
  if (!user) throw new AppError(404, "User not found");

  const deliveryLocationQuery = new QueryBuilder(
    DeliveryLocation.find({ user: user._id, isDeleted: false }),
    query
  )
    .search(["name", "place", "country", "region", "streetAndNumber"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await deliveryLocationQuery.modelQuery;
  const meta = await deliveryLocationQuery.countTotal();
  return { result, meta };
};

const updateDeliveryLocation = async (
  deliveryLocationId: string,
  payload: TDeliveryLocation
) => {
  if (payload.user) {
    const user = await User.findOne({ clerkId: payload.user });
   
    if (!user) throw new AppError(404, "User not found");
    payload.user = user._id;
  }
    
  const deliveryLocation = await DeliveryLocation.findByIdAndUpdate(
    deliveryLocationId,
    payload,
    { new: true }
  );
  if (!deliveryLocation) {
    throw new AppError(404, "Delivery location not found");
  }
  return deliveryLocation;
};

const deleteDeliveryLocationById = async (deliveryLocationId: string) => {
  const result = await DeliveryLocation.findByIdAndUpdate(
    deliveryLocationId,
    { isDeleted: true },
    { new: true }
  );

  if (!result) throw new AppError(404, "Delivery location not found");
  await User.findByIdAndUpdate(result.user, {
    //remove location from user
    $pull: { location: result._id },
  });

  return result;
};

export const DeliveryLocationService = {
  createDeliveryLocation,
  getAllDeliveryLocations,
  deleteDeliveryLocationById,
  updateDeliveryLocation,
  getAllDeliveryLocationsByUser,
};
