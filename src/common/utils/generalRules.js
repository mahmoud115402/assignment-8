import Joi from "joi";
import { Types } from "mongoose";
export const generalRules = {
   id: Joi.string().custom((value, helper) => {
    return Types.ObjectId.isValid(value) ? value : helper.message("InValid id")
}),
    email: Joi.string().email({ minDomainSegments: 2, maxDomainSegments: 2 }),
    password: Joi.string(),
    file: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string().required(),
        path: Joi.string(),
        destination: Joi.string(),
        filename: Joi.string(),
        size: Joi.number().required()
    }).messages({
        "any.required": "file is required",
    }),
    token: Joi.object({
        authorization: Joi.string().required(),
        connection: Joi.string(),
        "accept-encoding": Joi.string(),
        accept: Joi.string(),
        "user-agent": Joi.string(),
        host: Joi.string(),
        "content-length": Joi.string(),
        "postman-token": Joi.string(),
        "cache-control": Joi.string(),
    })
}