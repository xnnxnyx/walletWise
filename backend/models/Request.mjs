import mongoose from "mongoose";

const requestSchema = new mongoose.Schema({
  from: { type: String, required: true }, 
  to: { type: String, required: true }, 
}
);

const Request = mongoose.model("Request", requestSchema);

export default Request;
