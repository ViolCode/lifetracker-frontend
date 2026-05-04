import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import SchedulePage from "./pages/SchedulePage";
import ExpensesPage from "./pages/ExpensesPage";

export default function App() {
    return (
        <Routes>
            <Route element={<Layout />}>
                <Route path="/" element={<SchedulePage />} />
                <Route path="/expenses" element={<ExpensesPage />} />
            </Route>
        </Routes>
    );
}