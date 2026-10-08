import jwt from "jsonwebtoken";

import usermodel from "../../DB/models/user.model.js";
import { findOne } from "../../DB/DB.service.js";
export const authenticate = async (req, res, next) => {
    try {
        const { token } = req.headers;
if (!token){
  throw new Error("token not found")
}

const decoded = jwt.verify(token, "mahmoud123")
if (!decoded?.id) {throw new Error("invalid token")}
const user = await findOne({
 model: usermodel,
  filter: {
   email: decoded.email.toLowerCase(),
  
   }
 })
  if (!user) {
 throw new Error("user not exist");
  }
req.user = user;
  next();

 } catch (error) {
 throw new Error(error.message);
  }
};