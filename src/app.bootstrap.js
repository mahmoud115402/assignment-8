import express from "express";
import  connectDB from "./DB/connectionDB.js";
import userRouter from "./modules/users/user.controller.js";

const app = express();
const PORT = 3000;

const bootstrap = async () => {
  app.use(express.json());
  app.get("/", (req, res) => res.status(200).json({ message: "Hello, World!" }));

  await connectDB();
 app.use("/user", userRouter);

 app.use("{/*demo}", (req, res ,next ) => {throw new error(`Url:${req.originalUrl} With Method:${req.method} Not Found`,{cause:404})
 }); 

app.use((err, req, res, next) => {
  console.log(err);
  res.status(err.cause || 500).json({message: err.message, stack: err.stack });
});

 app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
};
export default bootstrap;