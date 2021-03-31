import express from "express";
import User from "./database.js";

let app = express();

function create_user(req, res, next) {
  let creds = req.get("Authorization");
  creds = creds.substr(creds.indexOf(" ") + 1);
  creds = Buffer.from(creds, "base64").toString("binary");
  console.log(creds);
  User.find({ userid: creds }, function (err, users) {
    if (users.length == 0) {
      let newUser = new User({
        userid: creds,
      });
      newUser.save();
    }
  });
  next();
}

app.get("/login", create_user, function (req, res) {
  res.status(200).end();
});

app.use(function (req, res) {
  res.status(404).send("Route not found");
});

app.use(function (err, req, res) {
  res.status(err.status || 500).send(err.message || "Error");
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
