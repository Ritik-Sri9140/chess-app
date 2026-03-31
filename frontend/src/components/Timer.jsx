import { useEffect, useState } from "react";

export default function Timer({ socket, roomId, color }) {
    const [time, setTime] = useState({ white: 300, black: 300 });

    useEffect(() => {
        socket.on("timerUpdate", (serverTime) => {
            setTime(serverTime);
        });

        return () => socket.off("timerUpdate");
    }, []);

    const format = (t) => {
        const m = Math.floor(t / 60);
        const s = t % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    return (
        <div style={{ marginBottom: "10px" }}>
            <div style={{
                background: "#020617",
                padding: "10px",
                borderRadius: "8px",
                marginBottom: "5px"
            }}>
                ⬜ White: {format(time.white)}
            </div>

            <div style={{
                background: "#020617",
                padding: "10px",
                borderRadius: "8px"
            }}>
                ⬛ Black: {format(time.black)}
            </div>
        </div>
    );
}