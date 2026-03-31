import { useEffect, useState } from "react";

export default function MoveHistory({ socket }) {
    const [moves, setMoves] = useState([]);

    useEffect(() => {
        socket.on("moveHistory", (history) => {
            setMoves(history);
        });

        return () => socket.off("moveHistory");
    }, []);

    return (
        <div style={{ marginTop: "10px" }}>
            <h4>Moves</h4>

            <div style={{
                maxHeight: "200px",
                overflowY: "auto",
                background: "#0f172a",
                padding: "10px",
                borderRadius: "8px"
            }}>
                {moves.map((move, i) => (
                    <div key={i}>
                        {i + 1}. {move}
                    </div>
                ))}
            </div>
        </div>
    );
}