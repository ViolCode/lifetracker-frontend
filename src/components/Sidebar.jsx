import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
    return (
        <div className="w-64 h-screen bg-gradient-to-b from-emerald-100 to-teal-100 flex flex-col justify-between p-6">
            <div>
                <h1 className="text-xl font-semibold mb-8">Life Tracker</h1>

                <nav className="flex flex-col gap-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            isActive ? "text-teal-600 font-semibold" : "text-gray-700"
                        }
                    >
                        Schedule
                    </NavLink>
                    <NavLink to="/expenses">Expenses</NavLink>
                </nav>
            </div>

            <div className="text-sm">
                <div className="mb-4">
                    <p className="font-medium">Username</p>
                    <p className="text-gray-500">user.name@gmail.com</p>
                </div>
                <button className="w-full bg-emerald-500 text-white py-2 rounded-lg hover:bg-emerald-600">
                    Sign out
                </button>
            </div>
        </div>
    );
}