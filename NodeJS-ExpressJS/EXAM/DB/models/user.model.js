import mongoose from "mongoose";

const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  mobileNumber: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  recoveryEmail: String,
  DOB: Date,
  lastName: String,
  firstName: String,
  // status: { type: String, enum: ["online", "offline"], default: "offline" },
});

const User = model("User", userSchema);

export default User;
