export default function GameControls({ socket, roomId }) {

    const resign = () => {
        socket.emit("resign", { roomId });
    };

    const offerDraw = () => {
        socket.emit("offerDraw", { roomId });
    };

    return (
        <div style={{ marginTop: "10px" }}>
            <button onClick={resign}>Resign</button>
            <button onClick={offerDraw}>Offer Draw</button>
        </div>
    );
}