import { getSellerModel } from "../../models/seller.model.js";

export const findSellerByEmailInDatabase = async (email) => {
    try {
        const sellerModel = await getSellerModel();
        const response = await sellerModel.findOne({ email });
        return response;
    } catch (error) {
        return { error };
    }
};

export const createNewSellerInDatabase = async (newSeller) => {
    try {
        const response = await newSeller.save();
        return response;
    } catch (error) {
        return { error };
    }
};

export const saveSellerRefreshTokenInDatabase = async (seller) => {
    try {
        const response = await seller.save({ validateBeforeSave: false });
        return response;
    } catch (error) {
        return { error };
    }
};

export const updateSellerProfileInDatabase = async (seller) => {
    try {
        const response = await seller.save();
        return response;
    } catch (error) {
        return { error };
    }
};

export const convertToSellerDatabaseObject = async (plainSellerObject) => {
    try {
        const sellerModel = await getSellerModel();
        const response = await sellerModel.hydrate(plainSellerObject);
        return response;
    } catch (error) {
        return { error };
    }
};
