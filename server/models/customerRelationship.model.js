import { getCustomerRelationshipMongoInstance } from "../factory/database.factory.js";

var CustomerRelationshipModel = undefined;
export const getCustomerRelationshipModel = async () => {
    if (CustomerRelationshipModel === undefined) {
        const customerRelationshipMongoInstance =
            await getCustomerRelationshipMongoInstance();

        const customerRelationshipSchema =
            new customerRelationshipMongoInstance.Schema({
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

        const customerRelationshipModel =
            customerRelationshipMongoInstance.model(
                "CustomerRelationship",
                customerRelationshipSchema
            );
        CustomerRelationshipModel = customerRelationshipModel;
    }

    return CustomerRelationshipModel;
};
