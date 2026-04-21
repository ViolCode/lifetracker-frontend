import { useEffect, useState } from "react";
import { getAllExpenses } from "../api/expenses";

export default function ExpensesPage() {

    const [expenses, setExpenses] = useState([]);

    useEffect(() => {
        load();
    }, []);

    const load = async () => {
        const data = await getAllExpenses();
        setExpenses(data);
    };

    return (
        <div className="p-6">
            <h1 className="text-xl font-semibold mb-4">All Expenses</h1>

            {expenses.map(e => (
                <div key={e.id} className="p-3 border-b">
                    €{e.amount} — {e.description}
                </div>
            ))}
        </div>
    );
}