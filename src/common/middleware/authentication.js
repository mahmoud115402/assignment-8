import jwt from "jsonwebtoken";

import usermodel from "../../DB/models/user.model.js";
import { findOne } from "../../DB/DB.service.js";

export const authenticate = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    throw new Error("token not found");
  }

  const decoded = jwt.verify(token, "mahmoud123");
  if (!decoded?.id) {
    throw new Error("invalid token");
  }

  const user = await findOne({
    model: usermodel,
    filter: {
      _id: decoded.id,
    },
  });
  if (!user) {
    throw new Error("user not exist");
  }

  if (user?.changeCredentialAt && user.changeCredentialAt.getTime() > decoded.iat * 1000) {
    throw new Error("token is invalid");
  }

  req.user = user;
  next();
};