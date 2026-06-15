import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function ProtectedRoute() {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const user = localStorage.getItem("user");

    useEffect(() => {
        const verifySession = async () => {
            try {
                await api("/events");
                setIsAuthenticated(true);
            } catch (error) {
                localStorage.removeItem("user");
                setIsAuthenticated(false);
            }
        };

        if (user) {
            verifySession();
        } else {
            setIsAuthenticated(false);
        }
    }, [user]);

    if (isAuthenticated === null) {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
}