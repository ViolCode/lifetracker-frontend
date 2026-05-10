import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Layout from "./layout/Layout";
import SchedulePage from "./pages/SchedulePage";
import ExpensesPage from "./pages/ExpensesPage";
import EventHistoryPage from "./pages/EventHistoryPage";

export default function App() {

    return (
        <>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                }}
            />

            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<SchedulePage />} />
                    <Route path="/expenses" element={<ExpensesPage />} />
                    <Route path="/history" element={<EventHistoryPage />} />
                </Route>
            </Routes>
        </>
    );
}