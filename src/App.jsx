import {
    Routes,
    Route,
    Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Layout from "./layout/Layout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SchedulePage from "./pages/SchedulePage";
import ExpensesPage from "./pages/ExpensesPage";
import EventHistoryPage from "./pages/EventHistoryPage";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {

    const isLoggedIn =
        !!localStorage.getItem("user");

    return (
        <>
        <Toaster position="top-right" />
        <Routes>
            <Route path="/" element={
                <Navigate to={isLoggedIn ? "/schedule" : "/login"} replace/>}
            />
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/register" element={<RegisterPage />}/>

            <Route element={<ProtectedRoute />}>
                <Route element={<Layout />}>
                    <Route path="/schedule" element={<SchedulePage />}/>
                    <Route path="/expenses" element={<ExpensesPage />}/>
                    <Route path="/history" element={<EventHistoryPage />}/>
                </Route>
            </Route>
        </Routes>
        </>
    );
}