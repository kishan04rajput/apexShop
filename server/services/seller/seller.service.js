import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    convertToSellerDatabaseObject,
    createNewSellerInDatabase,
    findSellerByEmailInDatabase,
    saveSellerRefreshTokenInDatabase,
    updateSellerProfileInDatabase,
} from "../../database/seller/seller.database.js";
import { getSellerModel } from "../../models/seller.model.js";
import {
    getSellerFromCache,
    setSellerInCache,
} from "../../cache/seller/seller.cache.js";

export const checkIfSellerExistsService = async (email) => {
    let seller = await getSellerFromCache(email);
    if (!seller) {
        seller = await findSellerByEmailInDatabase(email);
        if (null !== seller && seller.error) {
            return { error: seller.error };
        }

        await setSellerInCache(seller);
    }
    seller = convertToSellerDatabaseObject(seller);
    return seller;
};

export const createNewSellerService = async (email, password, salt) => {
    const sellerModel = await getSellerModel();
    const newSeller = new sellerModel({
        email,
        password,
        salt,
    });

    return await createNewSellerInDatabase(newSeller);
};

export const compareSellerPasswordService = async (
    sellerPassword,
    databasePassword
) => {
    try {
        const response = bcrypt.compareSync(sellerPassword, databasePassword);
        return response;
    } catch (error) {
        return { error };
    }
};

export const saveSellerRefreshTokenService = async (seller, refreshToken) => {
    seller.refreshToken = refreshToken;
    return await saveSellerRefreshTokenInDatabase(seller);
};

export const decodeSellerJwtTokenService = async (jwtToken, secretKey) => {
    // TODO: change name to suitable name which can justify its function
    try {
        return jwt.verify(jwtToken, secretKey);
    } catch (error) {
        return null;
    }
};

export const updateSellerProfileService = async (email, updatedData) => {
    let seller = await checkIfSellerExistsService(email);
    if (!seller) {
        return { error: "Seller Not Found!" };
    }

    updatedData.phone ? (seller.phone = updatedData.phone) : null;
    updatedData.name ? (seller.name = updatedData.name) : null;
    updatedData.password
        ? ((seller.password = updatedData.password),
          seller.oldPassword.push({
              password: seller.password,
              salt: seller.salt,
          }))
        : null;
    updatedData.salt ? (seller.salt = updatedData.salt) : null;
    updatedData.created_by
        ? (seller.created_by = updatedData.created_by)
        : null;
    updatedData.updated_by
        ? (seller.updated_by = updatedData.updated_by)
        : null;
    updatedData.is_deleted
        ? (seller.is_deleted = updatedData.is_deleted)
        : null;
    updatedData.deleted_at
        ? (seller.deleted_at = updatedData.deleted_at)
        : null;
    updatedData.is_deactivated
        ? (seller.is_deactivated = updatedData.is_deactivated)
        : null;
    updatedData.deactivated_at
        ? (seller.deactivated_at = updatedData.deactivated_at)
        : null;
    updatedData.DOB ? (seller.DOB = updatedData.DOB) : null;
    updatedData.Country ? (seller.Country = updatedData.Country) : null;
    updatedData.state ? (seller.state = updatedData.state) : null;
    updatedData.city ? (seller.city = updatedData.city) : null;
    const response = await updateSellerProfileInDatabase(seller);
    if (response.error) {
        return { error: "Seller Not Found!" };
    }
    return response;
};
