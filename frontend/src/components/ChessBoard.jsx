import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import { useRef, useState } from "react";

export default function ChessBoard({ socket, roomId, mode, playerColor }) {
    const gameRef = useRef(new Chess());

    const [fen, setFen] = useState(gameRef.current.fen());
    const [validMoves, setValidMoves] = useState([]);
    const [checkedSquare, setCheckedSquare] = useState(null);
    const [moveHistory, setMoveHistory] = useState([]);
    const [gameOver, setGameOver] = useState(false);
    const [winner, setWinner] = useState("");

    const moveSound = useRef(new Audio("/sounds/move.mp3"));
    const captureSound = useRef(new Audio("/sounds/capture.mp3"));
    const mateSound = useRef(new Audio("/sounds/checkmate.mp3"));

    // 🟢 SHOW VALID MOVES
    const onSquareClick = (square) => {
        const moves = gameRef.current.moves({
            square,
            verbose: true,
        });

        setValidMoves(moves.map((m) => m.to));
    };

    // 🎮 MOVE HANDLER
    const onDrop = (sourceSquare, targetSquare) => {
        if (gameOver) return false;

        const move = gameRef.current.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: "q",
        });

        if (!move) return false;

        // 🔊 SOUND
        if (gameRef.current.isCheckmate()) {
            mateSound.current.currentTime = 0;
            mateSound.current.play().catch(() => { });
        } else if (move.captured) {
            captureSound.current.currentTime = 0;
            captureSound.current.play().catch(() => { });
        } else {
            moveSound.current.currentTime = 0;
            moveSound.current.play().catch(() => { });
        }

        // 📜 HISTORY
        const color = move.color === "w" ? "white" : "black";
        setMoveHistory((prev) => [...prev, `${color} - ${move.san}`]);

        // 🔴 CHECK
        if (gameRef.current.isCheck()) {
            const board = gameRef.current.board();
            const checkedColor = gameRef.current.turn();

            let kingSq = null;

            for (let i = 0; i < 8; i++) {
                for (let j = 0; j < 8; j++) {
                    const piece = board[i][j];

                    if (
                        piece &&
                        piece.type === "k" &&
                        piece.color === checkedColor
                    ) {
                        const file = "abcdefgh"[j];
                        const rank = 8 - i;
                        kingSq = file + rank;
                    }
                }
            }

            setCheckedSquare(kingSq);
        } else {
            setCheckedSquare(null);
        }

        // ♟ CHECKMATE
        if (gameRef.current.isCheckmate()) {
            setGameOver(true);
            const win = gameRef.current.turn() === "w" ? "BLACK" : "WHITE";
            setWinner(win);
        }

        // 🟢 CLEAR DOTS
        setValidMoves([]);

        // 🔥 UPDATE BOARD (MOST IMPORTANT)
        setFen(gameRef.current.fen());

        // 🌐 ONLINE
        if (mode === "online") {
            socket?.emit("move", { roomId, move });
        }

        return true;
    };

    // 🎨 STYLES
    const customSquareStyles = {};

    // 🟢 VALID MOVES
    validMoves.forEach((sq) => {
        customSquareStyles[sq] = {
            background:
                "radial-gradient(circle, rgba(0,255,0,0.5) 30%, transparent 40%)",
        };
    });

    // 🔴 CHECK
    if (checkedSquare) {
        customSquareStyles[checkedSquare] = {
            backgroundColor: "rgba(255,0,0,0.7)",
        };
    }

    // 🔁 RESET
    const resetGame = () => {
        gameRef.current = new Chess();
        setFen(gameRef.current.fen());
        setMoveHistory([]);
        setCheckedSquare(null);
        setGameOver(false);
        setWinner("");
        setValidMoves([]);
    };

    return (
        <div style={{ textAlign: "center" }}>
            {/* 🔁 TURN */}
            <h3>
                Turn: {gameRef.current.turn() === "w" ? "WHITE" : "BLACK"}
            </h3>

            <div style={{ position: "relative", display: "inline-block" }}>
                <Chessboard
                    position={fen}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    boardWidth={500}
                    boardOrientation={playerColor || "white"}
                    customSquareStyles={customSquareStyles}
                    arePiecesDraggable={!gameOver}
                />

                {/* 💥 CHECKMATE OVERLAY */}
                {gameOver && (
                    <div
                        style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            background: "rgba(0,0,0,0.85)",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            flexDirection: "column",
                            zIndex: 10,
                            color: "white",
                        }}
                    >
                        <h1 style={{ color: "red" }}>CHECKMATE</h1>
                        <h2>{winner} WINS 🏆</h2>
                        <button onClick={resetGame}>
                            Play Again
                        </button>
                    </div>
                )}
            </div>

            {/* 📜 MOVE HISTORY */}
            <div style={{ marginTop: "20px" }}>
                <h3>Moves</h3>
                {moveHistory.map((m, i) => (
                    <p key={i}>
                        {i + 1}. {m}
                    </p>
                ))}
            </div>
        </div>
    );
}