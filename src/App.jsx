import React from "react";
import Sidebar from "./components/Sidebar";
import Schedule from "./pages/SchedulePage";

export default function App() {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 bg-white min-h-screen">
                <Schedule />
            </div>
        </div>
    );
}