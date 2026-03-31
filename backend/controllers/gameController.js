// import Game from "../models/Game.js";

// // SAVE GAME
// export const saveGame = async (req, res) => {
//     try {
//         const { players, moves, result } = req.body;

//         const game = await Game.create({
//             players,
//             moves,
//             result,
//         });

//         res.json(game);
//     } catch (err) {
//         res.status(500).json("Error saving game");
//     }
// };

// // GET ALL GAMES (for dashboard later)
// export const getGames = async (req, res) => {
//     try {
//         const games = await Game.find().sort({ createdAt: -1 });
//         res.json(games);
//     } catch (err) {
//         res.status(500).json("Error fetching games");
//     }
// };

import Game from "../models/Game.js";

// 📊 USER STATS
export const getUserStats = async (req, res) => {
    try {
        const userId = req.params.userId;

        const games = await Game.find({
            players: userId,
        });

        let wins = 0;
        let losses = 0;

        games.forEach((game) => {
            if (game.result === userId) wins++;
            else if (game.result) losses++;
        });

        res.json({
            total: games.length,
            wins,
            losses,
        });
    } catch (err) {
        res.status(500).json(err.message);
    }
};