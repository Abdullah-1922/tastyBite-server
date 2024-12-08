import { Schema, model } from "mongoose";
import { TDeliveryLocation } from "./deliveryLocation.interface";

const deliveryLocationSchema = new Schema<TDeliveryLocation>(
  {
    user: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    country: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    name: { type: String, required: true },
    place: { type: String, required: true },
    postcode: { type: String },
    region: { type: String, required: true },
    streetAndNumber: { type: String, required: true },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

const DeliveryLocation = model<TDeliveryLocation>(
  "DeliveryLocation",
  deliveryLocationSchema
);

export default DeliveryLocation;
