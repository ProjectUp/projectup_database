import mongoose from "mongoose";
import { db } from "./mongo.js";

const Schema = mongoose.Schema;
const userSchema = new Schema({
  firstName : {type : String, required : true},
  lastName : {type : String, required : true},
  email : {type : String, required : true, index : {unique : true}},
  userName : {type : String, required : true, index : {unique : true}},
  password : {type : String, required : true},
  team : String,
  image : {data : Buffer, contentType : String}
});

const User = mongoose.model("User", userSchema);

export { User };
