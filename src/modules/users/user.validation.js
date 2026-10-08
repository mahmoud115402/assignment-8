import Joi from "joi";


export const signupschema = {
    body: Joi.object({

    fname: Joi.string().alphanum().min(2).max(15).required(),
    lname: Joi.string().alphanum().min(2).max(15).required(),
    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required(),
    cpassword: Joi.string().valid(Joi.ref('password')).required(),
    age: Joi.number().min(20).max(60).integer().required(),
  }).required(),

query: Joi.object({
    flag: Joi.boolean().required()
})
};


export const signinschema = {
    body: Joi.object({

    email: Joi.string().email({ minDomainSegments: 2 }).required(),
    password: Joi.string().required()
  })

}
