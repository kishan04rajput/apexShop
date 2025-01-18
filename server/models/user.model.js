import { getUserMongoInstance } from "../factory/factory.js";

var UserModel = undefined;
export const getUserModel = async () => {
    if (UserModel === undefined) {
        const userMongoInstance = await getUserMongoInstance();

        const userSchema = new userMongoInstance.Schema({
            email: { type: String, required: true, unique: true },
            phone: { type: Number },
            name: { type: String },
            password: { type: String, required: true },
            salt: { type: String },
            created_at: { type: Date, default: Date.now },
            created_by: { type: String },
            updated_at: { type: Date },
            updated_by: { type: String },
            is_deleted: { type: Boolean, default: false },
            deleted_at: { type: Date },
            is_deactivated: { type: Boolean, default: false },
            deactivated_at: { type: Date },
            dob: { type: Date },
            country: { type: String },
            state: { type: String },
            city: { type: String },
            refreshToken: { type: String },
            oldPassword: [
                {
                    password: { type: String },
                    salt: { type: String },
                },
            ],
        });

        const userModel = userMongoInstance.model("User", userSchema);
        UserModel = userModel;
    }

    return UserModel;
};
