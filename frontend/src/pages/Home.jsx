// import { useState, useEffect } from "react";
// import socket from "../services/socket";
// import { useNavigate } from "react-router-dom";

// export default function Home() {
//     const [status, setStatus] = useState("");
//     const navigate = useNavigate();

//     // 🌐 ONLINE MATCH
//     const findMatch = () => {
//         socket.emit("findMatch");
//     };

//     // 👥 OFFLINE MATCH
//     const playOffline = () => {
//         navigate("/game/offline", {
//             state: {
//                 mode: "offline",
//                 color: "white",
//             },
//         });
//     };

//     useEffect(() => {
//         socket.on("waiting", () => {
//             setStatus("Waiting for opponent...");
//         });

//         socket.on("matchFound", ({ roomId, color }) => {
//             navigate(`/game/${roomId}`, {
//                 state: {
//                     mode: "online",
//                     color,
//                 },
//             });
//         });

//         return () => {
//             socket.off("waiting");
//             socket.off("matchFound");
//         };
//     }, []);

//     return (
//         <div style={{ textAlign: "center", marginTop: "100px" }}>
//             <h1>♟ Chess Game</h1>

//             <button onClick={findMatch} style={{ margin: "10px" }}>
//                 🌐 Play Online
//             </button>

//             <button onClick={playOffline} style={{ margin: "10px" }}>
//                 👥 Play Offline (2 Player)
//             </button>

//             <p>{status}</p>
//         </div>
//     );
// }



import { useEffect, useState } from "react";
import socket from "../services/socket";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const [status, setStatus] = useState("");
    const navigate = useNavigate();

    const playOffline = () => {
        navigate("/game/offline");
    };

    const findMatch = () => {
        socket.emit("findMatch");
    };

    useEffect(() => {
        socket.on("matchFound", ({ roomId, color }) => {
            navigate(`/game/${roomId}?mode=online&color=${color}`);
        });

        return () => socket.off("matchFound");
    }, []);

    return (
        <div style={{ textAlign: "center", marginTop: "100px", color: "black" }}>
            <h1>♟ Chess Arena</h1>

            {/* <button onClick={findMatch}>🌐 Play Online</button> */}
            <button onClick={playOffline}>👥 Play Offline</button>

            <p>{status}</p>
        </div>
    );
}