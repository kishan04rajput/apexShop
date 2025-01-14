import { validationResult } from "express-validator";
import { handleErrorResUtil } from "../utilities/handleErrorRes.util.js";

export const validateReqMW = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((validation) => validation.run(req)));
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            return next();
        }
        return handleErrorResUtil(res, 400, "failed", errors.array()[0]);
    };
};
