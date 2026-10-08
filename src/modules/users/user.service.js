import { Encrypt } from "../../common/security/encrypt.js";
import { compare, Hash } from "../../common/security/hash.js";
import * as dbsevice from "../../DB/DB.service.js";
import usermodel from "../../DB/models/user.model.js";
import jwt from "jsonwebtoken";
import  {OAuth2Client} from  'google-auth-library';
import { providerEnum } from "../../common/enum/user.enum.js";

const client = new OAuth2Client();

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

export const signupwithgmail = async (req, res, next) => {

  const { idToken } = req.body;

  const decoded = await client.verifyIdToken({
    idToken,
    audience: '761848223403-fdp54dj1cbcnt3946kgp8rjvtos2rssb.apps.googleusercontent.com',
  });
  const { family_name, given_name, picture, email_verified, email } = decoded.getPayload();
  let user = await usermodel.findOne({ email: email.toLowerCase(), provider: providerEnum.GOOGLE });
  if (!user) {
    user = await usermodel.create({
      fname: given_name,
      lname: family_name,
      email: email.toLowerCase(),
      profileImage: picture,
      isConfirmed: email_verified,
      provider: providerEnum.GOOGLE
    });
  }
  const accessToken = jwt.sign({ id: user._id, email: user.email }, "mahmoud123")
  const refreshToken = jwt.sign({ id: user._id }, "mahmoud1234")

  return res.status(200).json({ message: "done", tokens: { accessToken, refreshToken } });
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await dbsevice.findOne({
    model: usermodel,
    filter: { email: email.toLowerCase(), provider: providerEnum.SYSTEM },
  });

  if (!user) {
    throw new Error("user does not exist or invalid provider");
  }

 // if (user.isConfirmed !== true) {
 //   throw new Error("email not confirmed");
 // }

 // if (!await compare(password,user.password)) {
 //   throw new Error("invalid password");
 // }
const accessToken = jwt.sign({ id: user._id , email: user.email }, "mahmoud123", { audience: "http://localhost:4000" , issuer: "http://localhost:3000"})
const refreshToken = jwt.sign({ id: user._id }, "mahmoud1234")

  return res.status(200).json({ message: "done", tokens: { accessToken, refreshToken } });
};


export const getProfile = async (req, res, next) => {
    
    return res.status(200).json({ message: "Done" , user: req.user });

 };