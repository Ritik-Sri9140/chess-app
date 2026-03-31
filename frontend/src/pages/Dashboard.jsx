// import { useContext } from "react";
// import { AuthContext } from "../context/AuthContext";

// export default function Dashboard() {
//     const { user } = useContext(AuthContext);

//     if (!user) return <h2>Please login first</h2>;

//     return (
//         <div>
//             <h2>Dashboard</h2>

//             <p>Username: {user.username}</p>
//             <p>Email: {user.email}</p>
//             <p>Rating: {user.rating}</p>
//         </div>
//     );
// }


import { useEffect, useState } from "react";
import { getUserStats } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [stats, setStats] = useState({
        total: 0,
        wins: 0,
        losses: 0,
    });

    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchStats = async () => {
            const res = await getUserStats(user._id);
            setStats(res.data);
        };

        fetchStats();
    }, []);

    return (
        <div style={{ padding: "20px", textAlign: "center" }}>
            <h1>👤 {user?.username}'s Dashboard</h1>

            {/* 🔘 BUTTONS */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "20px"
            }}>
                <button onClick={() => alert("Leaderboard Coming Soon")}>
                    🏆 Leaderboard
                </button>

                <button onClick={() => navigate("/")}>
                    🏠 Home
                </button>
            </div>

            {/* 📊 STATS CARDS */}
            <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "20px",
                marginTop: "30px"
            }}>
                <div className="card">
                    <h3>Total Matches</h3>
                    <p>{stats.total}</p>
                </div>

                <div className="card">
                    <h3>Wins</h3>
                    <p>{stats.wins}</p>
                </div>

                <div className="card">
                    <h3>Losses</h3>
                    <p>{stats.losses}</p>
                </div>
            </div>
        </div>
    );
}