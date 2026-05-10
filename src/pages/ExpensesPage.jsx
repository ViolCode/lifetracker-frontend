import { useEffect, useState } from "react";

import Header from "../components/Header";

import { getAllExpenses } from "../api/expenses";

import { formatDate } from "../utils/format";
import { calculateMonthlyExpenses, calculateWeeklyExpenses,} from "../utils/expenseStats";

export default function ExpensesPage() {

    const [expenses, setExpenses] = useState([]);
    const [sortBy, setSortBy] = useState("new");

    const sortedExpenses = [...expenses].sort((a, b) => {

        const first = new Date(a.eventPlannedDate);
        const second = new Date(b.eventPlannedDate);

        return sortBy === "new"
            ? second - first
            : first - second;
    });

    const monthlyExpenses =
        calculateMonthlyExpenses(expenses);

    const weeklyExpenses =
        calculateWeeklyExpenses(expenses);

    async function loadExpenses() {

        try {

            const data = await getAllExpenses();

            setExpenses(data);

        } catch (e) {

            console.error("Failed to load expenses", e);
        }
    }

    useEffect(() => {
        loadExpenses();
    }, []);

    return (
        <div className="p-6 max-w-5xl mx-auto h-full flex flex-col">

            <div
                className="
        flex
        justify-between
        items-start
        mb-8
    "
            >

                <Header title="Expenses" />

                <div className="flex items-center gap-6">

                    <div className="text-right">

                        <div className="text-sm text-gray-500">
                            This Week
                        </div>

                        <div className="font-semibold">
                            €{weeklyExpenses.toFixed(2)}
                        </div>

                    </div>

                    <div className="text-right">

                        <div className="text-sm text-gray-500">
                            This Month
                        </div>

                        <div className="font-semibold">
                            €{monthlyExpenses.toFixed(2)}
                        </div>

                    </div>

                    <select
                        value={sortBy}
                        onChange={(e) =>
                            setSortBy(e.target.value)
                        }
                        className="
                border
                rounded-lg
                px-3
                py-2
                text-sm
                bg-white
            "
                    >

                        <option value="new">
                            Newest
                        </option>

                        <option value="old">
                            Oldest
                        </option>

                    </select>

                </div>

            </div>

            <div className="space-y-3 overflow-y-auto pr-2">
                {sortedExpenses.map(expense => (                    <div
                        key={expense.id}
                        className=" bg-white border rounded-xl p-4 flex justify-between items-start shadow-sm "
                    >
                        <div>
                            <div className="text-lg font-semibold">
                                €{expense.amount}
                            </div>

                            <div className="text-gray-600 text-sm mt-1">
                                {expense.description || "No description"}
                            </div>
                        </div>

                        <div className="text-sm text-gray-500 text-right">
                            <div>
                                {formatDate(expense.eventPlannedDate)}                            </div>
                        </div>
                    </div>
                ))}

                {expenses.length === 0 && (
                    <p className="text-gray-400">
                        No expenses found.
                    </p>
                )}
            </div>
        </div>
    );
}