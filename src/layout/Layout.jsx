import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";

export default function Layout() {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-y-auto bg-gray-50">
                <Outlet />
            </main>
        </div>
    );
}