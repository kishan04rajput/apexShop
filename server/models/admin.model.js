import { getAdminMongoInstance } from "../factory/database.factory.js";

var AdminModelInstance = undefined;
export const getAdminModel = async () => {
    if (AdminModelInstance === undefined) {
        const adminMongoDatabaseInstance = await getAdminMongoInstance();

        const adminSchema = new adminMongoDatabaseInstance.Schema({
            email: { type: String, required: true, unique: true },
            phone: { type: Number },
            name: { type: String },
            password: { type: String, required: true },
            salt: { type: String },
            created_at: { type: Date, default: Date.now() },
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
            type: {
                type: String,
                default: "normal",
            },
        });

        const adminModelInstance = adminMongoDatabaseInstance.model(
            "Admin",
            adminSchema
        );
        AdminModelInstance = adminModelInstance;
    }

    return AdminModelInstance;
};
