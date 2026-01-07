const express = require("express");
const app = express();

app.use("/", (req, res) => {
  res.send("Handling the / routes");
});

app.use("/", (req, res) => {
    res.json({message: "Response from /users"})
})

app.get("/user", (req, res) => {
  console.log("Handling first route!!");
  res.send("first Response");
});

app.post("/user/:id", (req, res) => {
  console.log("Handling first route!!");
  res.send("first Response");
});

app.get("/product", (req, res) => {
  console.log("Handling first route!!");
  res.send("first Response");
});

app.listen(3000, () => {
  console.log("server is successfully listening on the port 3000");
});
