import { Encrypt } from "../../common/security/encrypt.js";
import { compare, Hash } from "../../common/security/hash.js";
import * as dbsevice from "../../DB/DB.service.js";
import usermodel from "../../DB/models/user.model.js";


export const signup = async (req, res, next) => {
  const { fname, lname, email, password, age, gender ,phone  } = req.body;

  const emailExist = await dbsevice.findOne({
    model: usermodel,
    filter: { email: email.toLowerCase() },
  });

  if (emailExist) {
    throw new Error("email already exist");
  }

  const user = await dbsevice.create({
    model: usermodel,
    data: { fname, lname, email, password : await Hash(password), age, gender , phone : Encrypt(phone) },
  });

  return res.status(201).json({ message: "done", user });
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await dbsevice.findOne({
    model: usermodel,
    filter: { email: email.toLowerCase(), provider: "system" },
  });

  if (!user) {
    throw new Error("user does not exist or invalid provider");
  }

  if (user.isConfirmed !== true) {
    throw new Error("email not confirmed");
  }

  if (!await compare(password,user.password)) {
    throw new Error("invalid password");
  }

  return res.status(200).json({ message: "done", user });
};