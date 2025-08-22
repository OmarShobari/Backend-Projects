import mongoose from "mongoose";

const { Schema, model } = mongoose;

const jobSchema = new Schema({
  title: { type: String, required: true },
  description: String,
  company: { type: Schema.Types.ObjectId, ref: "Company", required: true },
  location: String,
  workingTime: String,
  seniorityLevel: String,
  technicalSkills: [String],
});

const Job = model("Job", jobSchema);

export default Job;
