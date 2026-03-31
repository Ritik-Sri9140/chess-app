import { Chess } from "chess.js";
import { v4 as uuidv4 } from "uuid";
import Game from "../models/Game.js";

const waitingPlayer = { socket: null };
const rooms = {};

const initSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("User connected:", socket.id);

        // 🎯 MATCHMAKING
        // socket.on("findMatch", () => {
        //     if (waitingPlayer.socket) {
        //         const roomId = uuidv4();

        //         const player1 = waitingPlayer.socket;
        //         const player2 = socket;

        //         rooms[roomId] = {
        //             time: {
        //                 white: 300,
        //                 black: 300,
        //             },
        //             turn: "white",
        //             interval: null,
        //             game: new Chess(),
        //             players: [player1.id, player2.id],
        //         };

        //         player1.join(roomId);
        //         player2.join(roomId);

        //         // Assign colors
        //         player1.emit("matchFound", {
        //             roomId,
        //             color: "white",
        //         });

        //         player2.emit("matchFound", {
        //             roomId,
        //             color: "black",
        //         });

        //         // Initial state
        //         io.to(roomId).emit("gameState", rooms[roomId].game.fen());
        //         io.to(roomId).emit("turn", "white");

        //         // Start timer
        //         startTimer(roomId, io);

        //         waitingPlayer.socket = null;
        //     } else {
        //         waitingPlayer.socket = socket;
        //         socket.emit("waiting");
        //     }
        // });

        socket.on("findMatch", () => {
            if (waitingPlayer.socket) {
                const roomId = uuidv4();

                const player1 = waitingPlayer.socket;
                const player2 = socket;

                rooms[roomId] = {
                    time: { white: 300, black: 300 },
                    turn: "white",
                    interval: null,
                    game: new Chess(),
                    players: [player1.id, player2.id],
                };

                player1.join(roomId);
                player2.join(roomId);

                player1.emit("matchFound", { roomId, color: "white" });
                player2.emit("matchFound", { roomId, color: "black" });

                io.to(roomId).emit("gameState", rooms[roomId].game.fen());
                io.to(roomId).emit("turn", "white");

                startTimer(roomId, io);

                waitingPlayer.socket = null;

            } else {
                waitingPlayer.socket = socket;
                socket.emit("waiting");
            }
        });

        // 🎮 MOVE
        socket.on("move", async ({ roomId, move }) => {
            const room = rooms[roomId];
            if (!room) return;

            const game = room.game;

            try {
                const result = game.move(move);

                if (result) {
                    // SWITCH TURN
                    room.turn = game.turn() === "w" ? "white" : "black";

                    io.to(roomId).emit("gameState", game.fen());
                    io.to(roomId).emit("turn", room.turn);

                    // SEND MOVE HISTORY
                    io.to(roomId).emit("moveHistory", game.history());

                    // CHECKMATE
                    if (game.isCheckmate()) {
                        clearInterval(room.interval);

                        await Game.create({
                            players: room.players,
                            moves: game.history(),
                            result: "checkmate",
                        });

                        io.to(roomId).emit("gameOver", {
                            result: "checkmate",
                            winner: room.turn === "white" ? "black" : "white",
                        });
                    }

                    // DRAW
                    if (game.isDraw()) {
                        clearInterval(room.interval);

                        await Game.create({
                            players: room.players,
                            moves: game.history(),
                            result: "draw",
                        });

                        io.to(roomId).emit("gameOver", {
                            result: "draw",
                        });
                    }
                }
            } catch (err) {
                console.log("Invalid move");
            }
        });

        // ❌ DISCONNECT
        socket.on("disconnect", () => {
            if (waitingPlayer.socket?.id === socket.id) {
                waitingPlayer.socket = null;
            }
            console.log("User disconnected:", socket.id);
        });
    });
};

// ⏱️ TIMER FUNCTION
const startTimer = (roomId, io) => {
    const room = rooms[roomId];

    room.interval = setInterval(async () => {
        room.time[room.turn]--;

        io.to(roomId).emit("timerUpdate", room.time);

        if (room.time[room.turn] <= 0) {
            clearInterval(room.interval);

            await Game.create({
                players: room.players,
                moves: room.game.history(),
                result: "timeout",
            });

            io.to(roomId).emit("gameOver", {
                result: "timeout",
                winner: room.turn === "white" ? "black" : "white",
            });
        }
    }, 1000);
};

export default initSocket;