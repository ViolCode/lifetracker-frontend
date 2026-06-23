import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";
import toast from "react-hot-toast";

export default function RegisterPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
        if (error) setError("");
    }

    async function handleSubmit(e) {
        e.preventDefault();

        if (!form.name.trim()) {
            setError("Name is required.");
            return;
        }

        if (!form.email.trim()) {
            setError("Email is required.");
            return;
        }

        if (form.password.length < 6) {
            setError("Password must be at least 6 characters.");
            return;
        }

        if (form.password !== form.confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {
            setLoading(true);

            await register({
                name: form.name,
                email: form.email,
                password: form.password,
            });

            toast.success("Account created! Please log in.");
            navigate("/login");
        } catch (e) {
            setError(
                e.status === 409
                    ? "An account with this email already exists."
                    : e.message
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-md w-[400px]">
                <h1 className="text-3xl font-bold mb-6 text-center">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        className="input w-full"
                    />

                    <input
                        name="email"
                        type="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        className="input w-full"
                    />

                    <input
                        name="password"
                        type="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        className="input w-full"
                    />

                    <input
                        name="confirmPassword"
                        type="password"
                        placeholder="Confirm password"
                        value={form.confirmPassword}
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
                        {loading ? "Creating..." : "Register"}
                    </button>
                </form>

                <p className="text-sm text-center mt-4">
                    Already have an account?
                    <Link to="/login" className="text-teal-600 ml-1">Login</Link>
                </p>
            </div>
        </div>
    );
}