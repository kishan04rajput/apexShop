import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    phone: {
        type: Number,
    },
    name: {
        type: String,
    },
    password: {
        type: String,
        required: true,
    },
    salt: {
        type: String,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
    created_by: {
        type: String,
    },
    updated_at: {
        type: Date,
    },
    updated_by: {
        type: String,
    },
    is_deleted: {
        type: Boolean,
        default: false,
    },
    deleted_at: {
        type: Date,
    },
    is_deactivated: {
        type: Boolean,
        default: false,
    },
    deactivated_at: {
        type: Date,
    },
    DOB: {
        type: Date,
    },
    Country: {
        type: String,
    },
    state: {
        type: String,
    },
    city: {
        type: String,
    },
    refreshToken: {
        type: String,
    },
    oldPassword: [
        {
            password: {
                type: String,
            },
            salt: {
                type: String,
            },
        },
    ],
});

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            id: this._id,
            email: this.email,
            role: 2,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign({ id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    });
};

export default mongoose.model("user", userSchema);
