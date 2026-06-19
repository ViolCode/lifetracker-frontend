import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../api/auth";

export default function RegisterPage() {

    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [loading, setLoading] =
        useState(false);

    function handleChange(e) {
        const { name, value } = e.target;
        setForm(prev => ({...prev, [name]: value,}));
    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (!form.name.trim()) {
            return;
        }

        if (!form.email.trim()) {
            return;
        }

        if (form.password.length < 6) {
            return;
        }

        if (
            form.password !==
            form.confirmPassword
        ) {
            return;
        }

        try {
            setLoading(true);

            const user =
                await register({
                    name: form.name,
                    email: form.email,
                    password: form.password,
                });

            navigate("/login");

        } catch (e) {
            // error handled silently
        } finally {

            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 ">
            <div className=" bg-white p-8 rounded-2xl shadow-md w-[400px]">
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

                    <button
                        disabled={loading}
                        className="w-full bg-teal-500 text-white py-3 rounded-lg hover:bg-teal-600 disabled:opacity-50">
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