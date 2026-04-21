import React from "react";

export default function Sidebar() {
    return (
        <div className="w-64 h-screen bg-gradient-to-b from-emerald-100 to-teal-100 flex flex-col justify-between p-6">
            <div>
                <h1 className="text-xl font-semibold mb-8">Life Tracker</h1>

                <nav className="flex flex-col gap-2">
                    <button className="text-left px-3 py-2 rounded-lg bg-white shadow-sm font-medium">
                        Schedule
                    </button>
                    <button className="text-left px-3 py-2 rounded-lg text-gray-600 hover:bg-white/60">
                        Expenses
                    </button>
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