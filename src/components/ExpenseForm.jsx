import { useState } from "react";
import { createExpense } from "../api/expenses";

export default function ExpenseForm({ eventId, onCreated }) {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async () => {
        if (!amount || isNaN(amount)) {
            alert("Enter valid amount");
            return;
        }

        try {
            await createExpense({
                eventId,
                amount: parseFloat(amount),
                description,
            });

            setAmount("");
            setDescription("");
            onCreated();
        } catch (e) {
            alert(e.message);
        }
    };

    return (
        <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold mb-2">Add Expense</h4>

            <input
                placeholder="Amount €"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="input mb-2"
            />

            <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input mb-2"
            />

            <button
                onClick={handleSubmit}
                className="bg-emerald-500 text-white px-3 py-1 rounded"
            >
                Add
            </button>
        </div>
    );
}