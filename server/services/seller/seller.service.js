import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import {
    convertToSellerDBObj,
    createNewSellerDB,
    findSellerUsingEmailDB,
    saveSellerRefreshTokenDB,
    sellerProfileUpdateDB,
} from "../../db/seller/seller.db.js";
import { getSellerModel } from "../../models/seller.model.js";
import {
    getSellerFromCache,
    setSellerInCache,
} from "../../cache/seller/seller.cache.js";

export const checkIfSellerExistSvc = async (email) => {
    let seller = await getSellerFromCache(email);
    if (!seller) {
        seller = await findSellerUsingEmailDB(email);
        if (!seller) {
            return null;
        }

        await setSellerInCache(seller);
    }
    seller = convertToSellerDBObj(seller);
    return seller;
};

export const createNewSellerSvc = async (email, password, salt) => {
    const sellerModel = await getSellerModel();
    const newSeller = new sellerModel({
        email,
        password,
        salt,
        oldPassword: [{ password, salt }],
    });

    return await createNewSellerDB(newSeller);
};

export const compareSellerPasswordSvc = async (sellerPassword, dbPassword) => {
    return bcrypt.compareSync(sellerPassword, dbPassword);
};

export const saveSellerRefreshTokenSvc = async (seller, refreshToken) => {
    seller.refreshToken = refreshToken;
    return await saveSellerRefreshTokenDB(seller);
};

export const decodeSellerJwtTokenSvc = async (jwtToken, key) => {
    // TODO: change name to suitable name which can justify it's function
    try {
        return jwt.verify(jwtToken, key);
    } catch (e) {
        return null;
    }
};

export const sellerProfileUpdateSvc = async (email, updatedData) => {
    let seller = await checkIfSellerExistSvc(email);
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
    return await sellerProfileUpdateDB(seller);
};
