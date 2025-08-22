import mongoose from "mongoose";

const { Schema, model } = mongoose;

const companySchema = new Schema({
  name: { type: String, required: true, unique: true },
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  description: String,
  location: String,
});

const Company = model("Company", companySchema);

export default Company;
