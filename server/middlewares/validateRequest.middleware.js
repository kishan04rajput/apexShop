import { validationResult } from "express-validator";
import { handleErrorResponseUtility } from "../utilities/response.util.js";
import { decryptPasswordUtility } from "../utilities/crypto.util.js";
import { passwordRulesValidationUtility } from "../utilities/validationRules.util.js";

export const validateRequestMiddleware = (validations) => {
    return async (request, response, nextFunction) => {
        // console.log("----->validateRequestMiddleware");
        if (request?.body?.password) {
            const plainTextPassword = decryptPasswordUtility(
                request?.body?.password
            );
            const passwordFollowsRules =
                passwordRulesValidationUtility(plainTextPassword);
            if (passwordFollowsRules.length > 0) {
                return handleErrorResponseUtility(
                    response,
                    404,
                    "failed",
                    passwordFollowsRules
                );
            }
            request.body.password = plainTextPassword;
        }
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
