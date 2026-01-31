import express from "express";
import userRoutes from "./routes/userRoutes.js";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  req.myName = "nimsbro";
  next();
});

app.use("/user", userRoutes);

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

app.listen(3000, () => {
  console.log("server running on port 3000");
});
