import { useState } from "react";
import { loginUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await loginUser(form);

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));

            navigate("/dashboard");
        } catch (err) {
            alert(err.response?.data || "Error");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>🔐 Login</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Email"
                        onChange={(e) =>
                            setForm({ ...form, email: e.target.value })
                        }
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        onChange={(e) =>
                            setForm({ ...form, password: e.target.value })
                        }
                    />

                    <button type="submit">Login</button>
                </form>

                <Link to="/register">
                    <button className="link-btn">
                        Go to Register
                    </button>
                </Link>

                <Link to="/">
                    <button className="home-btn">
                        🏠 Home
                    </button>
                </Link>
            </div>
        </div>
    );
}