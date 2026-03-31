import { Link } from "react-router-dom";

export default function Navbar() {
    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.clear();
        window.location.href = "/";
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "15px",
                background: "#020617",
                alignItems: "center",
            }}
        >
            <h2>♟ Chess App</h2>

            <div style={{ display: "flex", gap: "10px" }}>
                {user ? (
                    <>
                        <span>{user.username}</span>
                        <button onClick={logout}>Logout</button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            <button className="login-btn">Login</button>
                        </Link>
                        <Link to="/register">
                            <button className="register-btn">Register</button>
                        </Link>
                        {/* <button onClick={() => (window.location.href = "/dashboard")}>
                            Dashboard
                        </button> */}
                    </>
                )}
            </div>
        </div>
    );
}