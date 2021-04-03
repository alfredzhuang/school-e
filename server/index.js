import express from "express";
import { v4 as uuidv4 } from "uuid";
import User from "./database.js";

let app = express();
app.use(express.json());

app.get("/login", function (req, res) {
  let creds = req.get("Authorization");
  creds = creds.substr(creds.indexOf(" ") + 1);
  creds = Buffer.from(creds, "base64").toString("binary");
  try {
    User.find({ userid: creds }, function (err, user) {
      if (user.length == 0) {
        let newUser = new User({
          userid: creds,
          classes: [],
        });
        newUser.save();
      }
    });
  } catch (err) {
    console.log(err);
  }
  res.status(200).end();
});

app.post("/addclass", function (req, res) {
  try {
    let newClass = {
      classId: uuidv4(),
      className: req.body.className,
      classLink: req.body.classLink,
    };
    User.updateOne(
      { userid: req.body.userid },
      { $push: { classes: newClass } },
      function (err, result) {
        if (err) {
          console.log(err);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
  res.status(200).end();
});

app.post("/deleteclass", function (req, res) {
  try {
    User.updateOne(
      { userid: req.body.userid },
      {
        $pull: { classes: { classId: req.body.classId } },
      },
      function (err, result) {
        if (err) {
          console.log(err);
        }
      }
    );
  } catch (err) {
    console.log(err);
  }
  res.status(200).end();
});

app.get("/getclasses", function (req, res) {
  let creds = req.get("Authorization");
  creds = creds.substr(creds.indexOf(" ") + 1);
  creds = Buffer.from(creds, "base64").toString("binary");
  try {
    User.find({ userid: creds }, function (err, user) {
      res.send(user[0].classes);
    });
  } catch (err) {
    console.log(err);
  }
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
