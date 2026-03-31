import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
    rating: { type: Number, default: 1200 },
});

export default mongoose.model("User", userSchema);