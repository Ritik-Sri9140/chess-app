import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [form, setForm] = useState({
        username: "",
        email: "",
        password: "",
    });

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await registerUser(form);
            alert("Registered Successfully");
            navigate("/login");
        } catch (err) {
            alert(err.response?.data || "Error");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h2>📝 Register</h2>

                <form onSubmit={handleSubmit}>
                    <input
                        placeholder="Username"
                        onChange={(e) =>
                            setForm({ ...form, username: e.target.value })
                        }
                    />

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

                    <button type="submit">Register</button>
                </form>

                <Link to="/login">
                    <button className="link-btn">
                        Go to Login
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