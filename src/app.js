require("dotenv").config();
const express = require("express");
const cors= require("cors");
const User = require("./models/user");

const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const app = express();
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter); 
app.use("/", userRouter);

connectDB()
  .then(async () => {
    await User.syncIndexes();
    console.log("Database is successfully established");
    app.listen(3000, () => {
      console.log("server is successfully listening on the port 3000");
    });
  })
  .catch((err) => {
    console.log("Database is not connected");
    console.error(err);
  });
  
