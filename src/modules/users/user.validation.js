import Joi from "joi";
import {generalRules} from "../../common/utils/generalRules.js";
import { refreshtoken } from "./user.service.js";

export const signupschema = {
    body: Joi.object({

    fname: Joi.string().alphanum().min(2).max(15).required(),
    lname: Joi.string().alphanum().min(2).max(15).required(),
    email: generalRules.email.required(),
    password: generalRules.password.required(),
    cpassword: Joi.string().valid(Joi.ref('password')).required(),
    age: Joi.number().min(20).max(60).integer().required(),
    gender: Joi.string().valid("male", "female"),
    phone: Joi.string().required(),
  }).required(),
file: generalRules.file.required()

};


export const signinschema = {
    body: Joi.object({

    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required()
  })

}

export const logoutschema = {

  
}


export const refreshtokenschema = {
headers: generalRules.token.required()
}



export const shareProfileSchema = {
    params: Joi.object({
        id: generalRules.id.required(),
    }).required()
}


export const updateProfileSchema = {
   body: Joi.object({

    fname: Joi.string().alphanum().min(2).max(15),
    lname: Joi.string().alphanum().min(2).max(15),
    age: Joi.number().min(20).max(60).integer(),
    gender: Joi.string().valid("male", "female"),
    phone: Joi.string()
  }).required()
}




export const updatePasswordSchema = {
  body: Joi.object({
    oldPassword: generalRules.password.required(),
    newPassword: generalRules.password.required(),
  }).required()
}
