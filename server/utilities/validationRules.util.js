import { body } from "express-validator";

export const loginValidationRulesUtil = [
    body("email")
        .exists()
        .isEmail()
        .withMessage("Email must be a valid email address"),
    body("password").exists().withMessage("Password is required"),
];

export const signupValidationRulesUtil = [
    body("email")
        .exists()
        .isEmail()
        .withMessage("Email must be a valid email address"),
    body("password").exists().withMessage("Password is required"),
];

export const updateProfileValidationRulesUtil = [
    body("phone")
        .optional({ checkFalsy: true })
        .isMobilePhone()
        .withMessage("Phone must be a valid phone number"),
    body("name")
        .optional({ checkFalsy: true })
        .isString()
        .withMessage("Name must be a valid string"),
    body("DOB")
        .optional({ checkFalsy: true })
        .isDate()
        .withMessage("DOB must be a valid date"),
    body("Country")
        .optional({ checkFalsy: true })
        .isString()
        .withMessage("Country must be a valid string"),
    body("state")
        .optional({ checkFalsy: true })
        .isString()
        .withMessage("State must be a valid string"),
    body("city")
        .optional({ checkFalsy: true })
        .isString()
        .withMessage("City must be a valid string"),
];

export const updatePasswordValidationRulesUtil = [
    body("password").exists().withMessage("Password is required"),
];
