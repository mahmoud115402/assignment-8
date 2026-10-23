import { Router } from "express";
import * as US from "./user.service.js"
import { authenticate } from "../../common/middleware/authentication.js";
import { authorization } from "../../common/middleware/authorization.js";
import { roleEnum } from "../../common/enum/user.enum.js";
import { Valiidation } from "../../common/middleware/validation.js";
import { refreshtokenschema, shareProfileSchema, signinschema, signupschema, updatePasswordSchema, updateProfileSchema } from "./user.validation.js";
import { Localmulter } from "../../common/middleware/multer.js";

const userRouter = Router();

userRouter.post(
  "/signup",
  Localmulter("users", ["image/jpeg", "image/png"]).single("image"),
  Valiidation(signupschema),
  US.signup
)
userRouter.post("/signup/gmail", US.signupwithgmail)
userRouter.post("/refreshtoken", Valiidation(refreshtokenschema), US.refreshtoken)
userRouter.get("/signin", Valiidation(signinschema), US.signin)
userRouter.get("/profile", authenticate, authorization([roleEnum.admin, roleEnum.user]), US.getProfile)
userRouter.patch("/logout", authenticate, US.logout)
userRouter.patch(
  "/profile-image",
  authenticate,
  Localmulter("users", ["image/jpeg", "image/png"]).single("image"),
  US.uploadProfileImage
)
userRouter.get("/signin", Valiidation(signinschema), US.signin)
userRouter.get("/share-profile/:id",Valiidation(shareProfileSchema), US.shareProfile)
userRouter.patch("/update-profile",Valiidation(updateProfileSchema),authorization, US.updateProfile)
userRouter.patch("/update-password", Valiidation(updatePasswordSchema), authorization, US.updatePassword)


export default userRouter