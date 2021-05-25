import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

mongoose.connect(process.env.MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let usersSchema = new mongoose.Schema({
  userid: String,
  classes: [Object],
  tasks: [Object],
  emails: [Object],
});

let User = mongoose.model("User", usersSchema);

export default User;
