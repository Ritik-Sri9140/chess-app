import { Chess } from "chess.js";

export function getBestMove(game) {
    const moves = game.moves();

    return moves[Math.floor(Math.random() * moves.length)];
}