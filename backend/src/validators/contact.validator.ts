import { body, type ValidationChain } from "express-validator";

export const contactRules: ValidationChain[] = [
  body("name")
    .trim()
    .isString()
    .withMessage("Name must be a string")
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2, max: 120 })
    .withMessage("Name must be between 2 and 120 characters"),

  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("A valid email address is required")
    .isLength({ max: 254 })
    .withMessage("Email must be 254 characters or fewer"),

  body("subject")
    .optional({ values: "null" })
    .trim()
    .isString()
    .withMessage("Subject must be a string")
    .isLength({ max: 200 })
    .withMessage("Subject must be 200 characters or fewer"),

  body("message")
    .trim()
    .isString()
    .withMessage("Message must be a string")
    .notEmpty()
    .withMessage("Message is required")
    .isLength({ min: 10, max: 5000 })
    .withMessage("Message must be between 10 and 5000 characters"),
];
