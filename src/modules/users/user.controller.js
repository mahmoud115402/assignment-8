import { Router } from "express";
import * as US from "./user.service.js"
const userRouter = Router();

userRouter.post("/signup", US.signup)
userRouter.get("/signin",US.signin)






export default userRouter