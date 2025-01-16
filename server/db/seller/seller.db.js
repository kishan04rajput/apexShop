import { getSellerModel } from "../../models/seller.model.js";

export const findSellerUsingEmailDB = async (email) => {
    const sellerModel = await getSellerModel();
    return await sellerModel.findOne({ email });
};

export const createNewSellerDB = async (newSeller) => {
    return await newSeller.save();
};

export const saveSellerRefreshTokenDB = async (seller) => {
    return await seller.save({ validateBeforeSave: false });
};

export const sellerProfileUpdateDB = async (seller) => {
    return await seller.save();
};

export const convertToSellerDBObj = async (plainSellerObj) => {
    const sellerModel = await getSellerModel();
    let Seller = await sellerModel.hydrate(plainSellerObj);
    return Seller;
};
