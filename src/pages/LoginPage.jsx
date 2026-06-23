import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../api/auth";

export default function LoginPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.email.trim() || !form.password) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);
            const user = await login(form);
            localStorage.setItem("user", JSON.stringify(user));
            navigate("/schedule", { replace: true });
        } catch (e) {
            if (e.message === "Cannot reach the server. Check your internet connection.") {
                setError(e.message);
            } else {
                setError("Wrong email or password.");
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-[400px]">
                <h1 className="text-3xl font-bold mb-6 text-center">Login</h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="input w-full"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="input w-full"
                    />

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                            {error}
                        </p>
                    )}

                    <button
                        disabled={loading}
                        className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50"
                    >
                        {loading ? "Logging in..." : "Login"}
                    </button>
                </form>

                <p className="text-center text-sm mt-4">
                    Don't have account?
                    <Link to="/register" className="text-teal-600 ml-1">
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}