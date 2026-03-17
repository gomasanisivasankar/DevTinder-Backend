require("dotenv").config();
const express = require("express");
const cors= require("cors");
const User = require("./models/user");
const initializeSocket=require("./utils/socket");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter=require("./routes/payment");
const passport = require("./config/passport");
const app = express();
const http = require("http");
const chatRouter = require("./routes/chat");
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true,
}));

app.use("/payment/webhook", express.raw({ type: "application/json" }));
app.use(express.json());
app.use(cookieParser());

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter); 
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);


const server=http.createServer(app);
initializeSocket(server);
 
connectDB()
  .then(async () => {
    await User.syncIndexes();
    console.log("Database is successfully established");
    server.listen(process.env.PORT, () => {
      console.log("server is successfully listening on the port 3000");
    });
  })
  .catch((err) => {
    console.log("Database is not connected");
    console.error(err);
  });
  
