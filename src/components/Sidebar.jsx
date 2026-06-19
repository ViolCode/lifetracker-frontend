import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from "../api/auth";

export default function Sidebar() {
    const user = JSON.parse(localStorage.getItem("user"));
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await logout();
        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            localStorage.removeItem("user");
            navigate("/login");
        }
    }

    return (
        <div className="w-64 h-screen bg-gradient-to-b from-emerald-100 to-teal-100 flex flex-col justify-between p-6">
            <div>
                <h1 className="text-xl font-semibold mb-8">Life Tracker</h1>

                <nav className="flex flex-col gap-2">
                    <NavLink to="/schedule"
                        className={({ isActive }) =>
                            isActive ? "text-teal-600 font-semibold" : "text-gray-700"
                        }>
                        Schedule
                    </NavLink>
                    <NavLink to="/expenses"
                        className={({ isActive }) =>
                            isActive ? "text-teal-600 font-semibold" : "text-gray-700"
                        }>
                        Expenses List
                    </NavLink>
                    <NavLink to="/history"
                        className={({ isActive }) =>
                            isActive ? "text-teal-600 font-semibold" : "text-gray-700"
                        }>
                        Event History
                    </NavLink>
                </nav>
            </div>

            <div className="text-sm">
                <div className="mb-4">
                    <p className="font-medium">{user?.name}</p>
                    <p className="text-gray-500">{user?.email}</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600 ">
                    Sign out
                </button>
            </div>
        </div>
    );
}