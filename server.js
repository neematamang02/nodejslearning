import express from "express";
import userRoutes from "./routes/userRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { connectDB } from "./config/db.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import { logMiddleware } from "./middlewares/logMiddleware.js";
import logger from "./utils/logger.js";
import { connectRedis } from "./config/redis.js";
import config from "./config/index.js";
import passport from "passport";
import "./config/passport.js";

const app = express();
app.use(logMiddleware);
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
connectDB();
app.use("/user", userRoutes);
app.use("/api", authRoutes);
app.use(errorMiddleware);
// app.get("/people", (req, res) => {
//   res.send(req.myName);
// });

// const auth = (req, res, next) => {
//   const loggedIn = false;

//   if (!loggedIn) {
//     return res.send("Not authorized");
//   }

//   next();
// };

// app.get("/secret", auth, (req, res) => {
//   res.send("secret data");
// });

// app.get("/", (req, res) => {
//   res.send("hello there i am the user");
// });

// app.get("/user", (req, res) => {
//   res.json({ name: "Neema", role: "admin" });
// });

// app.post("/register", (req, res) => {
//   console.log(req.body);
//   res.status(201).json({ message: "created successfully" });
// });

// app.use("/user", userRoutes);
await connectRedis();
app.listen(config.app.port, () => {
  // console.log("server running on port 3000");
  logger.info({
    port: config.app.port,
    env: config.app.env,
  }, "Server started successfully");
});
