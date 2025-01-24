import { getSellerModel } from "../../models/seller.model.js";

export const findSellerByEmailInDatabase = async (email) => {
    const sellerModel = await getSellerModel();
    return await sellerModel.findOne({ email });
};

export const createNewSellerInDatabase = async (newSeller) => {
    return await newSeller.save();
};

export const saveSellerRefreshTokenInDatabase = async (seller) => {
    return await seller.save({ validateBeforeSave: false });
};

export const updateSellerProfileInDatabase = async (seller) => {
    return await seller.save();
};

export const convertToSellerDatabaseObject = async (plainSellerObject) => {
    const sellerModel = await getSellerModel();
    let sellerInstance = await sellerModel.hydrate(plainSellerObject);
    return sellerInstance;
};
