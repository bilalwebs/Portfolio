import { body, type ValidationChain } from "express-validator";

export const contactRules: ValidationChain[] = [
  body("name")
    .trim()
    .isString()
    .withMessage("Full name must be valid text.")
    .notEmpty()
    .withMessage("Please enter your full name.")
    .isLength({ min: 2, max: 120 })
    .withMessage("Full name must be between 2 and 120 characters."),

  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Please enter a valid email address.")
    .isLength({ max: 254 })
    .withMessage("Email must be 254 characters or fewer."),

  body("subject")
    .optional({ values: "null" })
    .trim()
    .isString()
    .withMessage("Subject must be valid text.")
    .isLength({ max: 200 })
    .withMessage("Subject must be 200 characters or fewer."),

  body("message")
    .trim()
    .isString()
    .withMessage("Message must be valid text.")
    .notEmpty()
    .withMessage("Please enter a message.")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters."),
];
