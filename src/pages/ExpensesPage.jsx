import { useEffect, useState } from "react";
import Header from "../components/Header";
import { getAllExpenses } from "../api/expenses";
import { formatDate } from "../utils/format";
import { calculateMonthlyExpenses, calculateWeeklyExpenses } from "../utils/expenseStats";
import toast from "react-hot-toast";

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
}

function getGroupKey(dateStr, groupBy) {
    const d = new Date(dateStr);
    if (groupBy === "week") {
        const monday = getWeekStart(d);
        return monday.toISOString().slice(0, 10);
    }
    if (groupBy === "month") return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    return String(d.getFullYear());
}

function getGroupLabel(key, groupBy) {
    if (groupBy === "week") {
        const monday = new Date(key);
        const sunday = new Date(monday);
        sunday.setDate(monday.getDate() + 6);
        const fmt = d => d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
        return `${fmt(monday)} – ${fmt(sunday)}`;
    }
    if (groupBy === "month") {
        const [year, month] = key.split("-");
        return new Date(year, month - 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
    }
    return key;
}

function groupExpenses(expenses, groupBy, sortBy) {
    const sorted = [...expenses].sort((a, b) => {
        const first = new Date(a.eventPlannedDate);
        const second = new Date(b.eventPlannedDate);
        return sortBy === "new" ? second - first : first - second;
    });

    const map = new Map();
    for (const expense of sorted) {
        const key = getGroupKey(expense.eventPlannedDate, groupBy);
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(expense);
    }
    return map;
}

export default function ExpensesPage() {
    const [expenses, setExpenses] = useState([]);
    const [sortBy, setSortBy] = useState("new");
    const [groupBy, setGroupBy] = useState("week");
    const [loadError, setLoadError] = useState("");

    const monthlyExpenses = calculateMonthlyExpenses(expenses);
    const weeklyExpenses = calculateWeeklyExpenses(expenses);
    const grouped = groupExpenses(expenses, groupBy, sortBy);

    async function loadExpenses() {
        try {
            const data = await getAllExpenses();
            setExpenses(data);
            setLoadError("");
        } catch (e) {
            const fullMsg = `Could not load your expenses. ${e.message}`;
            setLoadError(fullMsg);
            toast.error(fullMsg);
        }
    }

    useEffect(() => {
        loadExpenses();
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto h-full flex flex-col">

            <div className="flex justify-between items-start mb-8">

                <Header title="Expenses" />

                <div className="flex items-center gap-6">

                    <div className="text-right">
                        <div className="text-sm text-gray-500">This Week</div>
                        <div className="font-semibold">€{weeklyExpenses.toFixed(2)}</div>
                    </div>

                    <div className="text-right">
                        <div className="text-sm text-gray-500">This Month</div>
                        <div className="font-semibold">€{monthlyExpenses.toFixed(2)}</div>
                    </div>

                    <select
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        <option value="new">Newest</option>
                        <option value="old">Oldest</option>
                    </select>

                    <select
                        value={groupBy}
                        onChange={e => setGroupBy(e.target.value)}
                        className="border rounded-lg px-3 py-2 text-sm bg-white"
                    >
                        <option value="week">By Week</option>
                        <option value="month">By Month</option>
                        <option value="year">By Year</option>
                    </select>

                </div>

            </div>

            {loadError && (
                <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg px-4 py-3 mb-4 text-sm flex items-center gap-2">
                    <span>{loadError}</span>
                    <button onClick={loadExpenses} className="ml-auto text-red-700 underline">
                        Retry
                    </button>
                </div>
            )}

            <div className="space-y-6 overflow-y-auto pr-2">
                {!loadError && grouped.size === 0 && (
                    <p className="text-gray-400">No expenses found.</p>
                )}

                {[...grouped.entries()].map(([key, items]) => (
                    <div key={key}>
                        <div className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">
                            {getGroupLabel(key, groupBy)}
                        </div>

                        <div className="space-y-3">
                            {items.map(expense => (
                                <div
                                    key={expense.id}
                                    className="bg-white border rounded-xl p-4 flex justify-between items-start shadow-sm"
                                >
                                    <div>
                                        <div className="text-lg font-semibold">
                                            €{expense.amount}
                                        </div>
                                        <div className="text-gray-600 text-sm mt-1">
                                            {expense.description || "No description"}
                                        </div>
                                        {expense.eventTitle && (
                                            <div className="text-xs text-gray-400 mt-1">
                                                {expense.eventTitle}
                                            </div>
                                        )}
                                    </div>

                                    <div className="text-sm text-gray-500 text-right">
                                        <div>{formatDate(expense.eventPlannedDate)}</div>
                                        {expense.addedByName && (
                                            <div className="text-xs text-gray-400 mt-1">
                                                by {expense.addedByName}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}