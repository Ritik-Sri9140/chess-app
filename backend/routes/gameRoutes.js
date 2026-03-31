// import express from "express";
// import { saveGame, getGames } from "../controllers/gameController.js";
// import authMiddleware from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/save", authMiddleware, saveGame);
// router.get("/", authMiddleware, getGames);

// export default router;

import express from "express";
import { getUserStats } from "../controllers/gameController.js";

const router = express.Router();

router.get("/stats/:userId", getUserStats);

export default router;