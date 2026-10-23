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
   data: { fname, lname, email, password : await Hash(password), age, gender , phone : Encrypt(phone), profileImage: req.file?.path },
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
    filter: { email: email.toLowerCase(),provider: providerEnum.SYSTEM },
  });

  if (!user) {
    throw new Error("user does not exist or invalid provider");
  }

 // if (user.isConfirmed !== true) {
 //   throw new Error("email not confirmed");
 // }

  if (!await compare(password,user.password)) {
    throw new Error("invalid password");
  }
const accessToken = jwt.sign({ id: user._id , email: user.email }, "mahmoud123", { audience: "http://localhost:4000" , issuer: "http://localhost:3000"})
const refreshToken = jwt.sign({ id: user._id }, "mahmoud1234")

  return res.status(200).json({ message: "done", tokens: { accessToken, refreshToken } });
};


export const getProfile = async (req, res, next) => {
    
    return res.status(200).json({ message: "Done" , user: req.user });

 };


 export const logout = async (req, res, next) => {

    req.user.changeCredentialAt = new Date()

    await req.user.save()

    return res.status(200).json({ message: "Done" });
};
 


 export const uploadProfileImage = async (req, res, next) => {
  if (!req.file) {
    throw new Error("image is required", { cause: 400 });
  }

  const user = await dbsevice.findByIdAndUpdate({
    model: usermodel,
    id: req.user._id,
    update: { profileImage: req.file.path },
  });

  return res.status(200).json({ message: "done", user });
 }


 export const refreshtoken = async (req, res, next) => {

  const { authorization } = req.headers;

  if (!authorization) {
    throw new Error("authorization is required", { cause: 400 });
  }
const decoded = jwt.verify(authorization, "mahmoud1234");
    if (!decoded?.id) {
      throw new Error("invalid token");
    }
  
const user = await dbsevice.findOne({
        model: usermodel,
      filter: {
        _id: decoded.id,
      },
    });
    if (!user) {
      throw new Error("user not exist");
    }
  
    if (user.changecredentialsAt && (user.changecredentialsAt.getTime() / 1000) > decoded.iat) {
      throw new Error("token is invalid");
    }
  const accessToken = jwt.sign({ id: user._id , email: user.email }, "mahmoud123", { audience: "http://localhost:4000" , issuer: "http://localhost:3000"})

  return res.status(200).json({ message: "done", accessToken });
    };

    export const shareProfile = async (req, res, next) => {
    const {id} = req.params; 
    const user = await dbsevice.findById({
      model: usermodel,
      id: id,
      options: { password: -1 }
    });
    if(!user){
      throw new Error("user not found");
    }
    return res.status(200).json({ message: "Done" , user });

 };



export const updateProfile = async (req, res, next) => {
    const { fname, lname, age, gender, phone } = req.body

    let updateQuery = {}

    if (fname !== undefined) {
        updateQuery.fname = fname
    }
    if (lname !== undefined) {
        updateQuery.lname = lname
    }
    if (age !== undefined) {
        updateQuery.age = age
    }
    if (gender !== undefined) {
        updateQuery.gender = gender
    }
    if (phone !== undefined) {
        updateQuery.phone = Encrypt(phone)
    }

    let user = await dbsevice.findByIdAndUpdate({
        model: usermodel,
        id: req.user._id,
        update: updateQuery,
    })

    return res.status(201).json({ message: "Donne", user })
};

export const updatePassword = async (req, res, next) => {
    const { oldPassword, newPassword } = req.body

    console.log(!Compare(oldPassword, req.user.password));

    if (!await Compare(oldPassword, req.user.password)) {
        throw new Error("InValid old password");
    }

    req.user.password = await Hash(newPassword)

    await req.user.save()

    return res.status(201).json({ message: "Donne", user })
};