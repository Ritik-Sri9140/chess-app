import mongoose from "mongoose";

const gameSchema = new mongoose.Schema({
    players: [String],
    moves: [String],
    result: String,
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Game", gameSchema);