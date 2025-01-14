import { getCrMongoInstance } from "../factory/factory.js";

var CrModel = undefined;
export const getCrModel = async () => {
    if (CrModel === undefined) {
        const crMongoInstance = await getCrMongoInstance();

        const crSchema = new crMongoInstance.Schema({
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
            DOB: { type: Date },
            Country: { type: String },
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

        const crModel = crMongoInstance.model("CR", crSchema);
        CrModel = crModel;
    }

    return CrModel;
};
