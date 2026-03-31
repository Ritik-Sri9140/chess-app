// import { useParams, useLocation } from "react-router-dom";
// import ChessBoard from "../components/ChessBoard";
// import Timer from "../components/Timer";
// import socket from "../services/socket";

// export default function Game() {
//     const { roomId } = useParams();
//     const location = useLocation();

//     // 🔥 SAFE MODE DETECTION
//     const query = new URLSearchParams(location.search);

//     const mode =
//         query.get("mode") ||
//         location.state?.mode ||
//         (roomId === "offline" ? "offline" : "online");

//     const playerColor =
//         query.get("color") ||
//         location.state?.color ||
//         "white";

//     console.log("MODE:", mode);
//     console.log("SOCKET:", socket);

//     return (
//         <div style={{ textAlign: "center" }}>
//             <h2>
//                 {mode === "offline"
//                     ? "Offline Game"
//                     : `Room: ${roomId}`}
//             </h2>

//             {mode === "online" && (
//                 <Timer socket={socket} roomId={roomId} />
//             )}

//             <ChessBoard
//                 socket={socket}   // 🔥 ALWAYS PASS
//                 roomId={roomId}
//                 mode={mode}
//                 playerColor={playerColor}
//             />
//         </div>
//     );
// }

import { useParams, useLocation, useNavigate } from "react-router-dom";
import ChessBoard from "../components/ChessBoard";
import Timer from "../components/Timer";
import socket from "../services/socket";

export default function Game() {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const playerColor = location.state?.color;
    const mode = location.state?.mode || "offline"; // 🔥 default offline

    // 🏠 HOME BUTTON FUNCTION
    const goHome = () => {
        navigate("/");
    };

    return (
        <div style={{ textAlign: "center", padding: "20px" }}>
            {/* 🔝 HEADER */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <h2>Room: {roomId || "Offline Game"}</h2>

                {/* 🏠 HOME BUTTON */}
                <button
                    onClick={goHome}
                    style={{
                        padding: "8px 15px",
                        background: "#ef4444",
                        border: "none",
                        borderRadius: "8px",
                        color: "white",
                        cursor: "pointer",
                    }}
                >
                    🏠 Home
                </button>
            </div>

            {/* 👤 PLAYER INFO */}
            {mode === "online" && (
                <p>You are: {playerColor}</p>
            )}

            {/* ⏱ TIMER (ONLY ONLINE) */}
            {mode === "online" && (
                <Timer socket={socket} roomId={roomId} />
            )}

            {/* ♟ CHESS BOARD */}
            <ChessBoard
                socket={socket}
                roomId={roomId}
                playerColor={playerColor}
                mode={mode}
            />
        </div>
    );
}