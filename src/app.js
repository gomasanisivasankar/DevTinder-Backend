require("dotenv").config();
const express = require("express");

const User = require("./models/user");
const connectDB = require("./config/database");
const app = express();
app.use(express.json())
app.post("/signup", async (req, res) => {
  
  const user = new User(req.body);
  try {
    await user.save();
    res.send("data added successfully");
  } catch (err) {
    res.status(500).send("Error saving the user" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database is successfully established");
    app.listen(3000, () => {
      console.log("server is successfully listening on the port 3000");
    });
  })
  .catch((err) => {
    console.log("Database is not connected");
  });
