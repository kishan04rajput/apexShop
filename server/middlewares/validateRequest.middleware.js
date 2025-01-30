import { validationResult } from "express-validator";
import { handleErrorResponseUtility } from "../utilities/response.util.js";

export const validateRequestMiddleware = (validations) => {
    return async (request, response, nextFunction) => {
        // console.log("----->validateRequestMiddleware");
        try {
            await Promise.all(
                validations.map((validation) => validation.run(request))
            );
            const errors = validationResult(request);
            if (errors.isEmpty()) {
                return nextFunction();
            }
            return handleErrorResponseUtility(
                response,
                400,
                "failed",
                errors.array()[0]
            );
        } catch (error) {
            return handleErrorResponseUtility(
                response,
                400,
                "failed",
                "error at validateRequestMiddleware"
            );
        }
    };
};
