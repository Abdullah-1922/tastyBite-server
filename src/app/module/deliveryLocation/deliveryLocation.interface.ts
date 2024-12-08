import { Types } from "mongoose";

export type TDeliveryLocation ={
    user: Types.ObjectId,
    country: string,
    latitude: number,
    longitude: number,
    name: string,
    place: string,
    postcode?: string,
    region: string,
    streetAndNumber: string,
    isDeleted?: boolean,
}