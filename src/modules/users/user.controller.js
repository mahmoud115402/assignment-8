import { Router } from "express";
import * as US from "./user.service.js"
import { authenticate } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { roleEnum } from "../../common/enum/user.enum.js";
import { Valiidation } from "../../common/middleware/validation.js";
import { signupschema } from "./user.validation.js";
import { Localmulter } from "../../common/middleware/multer.js";

const userRouter = Router();

userRouter.post("/signup", Validation(signupschema), US.signup)
userRouter.post("/signup/gmail", US.signupwithgmail)

userRouter.get("/signin", Validation(signinschema), US.signin)
userRouter.get("/profile", authenticate, authorization([roleEnum.admin, roleEnum.user]), US.getProfile)




export default userRouter