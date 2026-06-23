import { useState } from "react";

export default function ExpenseForm({ onSubmit, loading }) {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [error, setError] = useState("");

    function handleSubmit() {
        if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
            setError("Please enter a valid amount.");
            return;
        }

        setError("");
        onSubmit({
            amount: parseFloat(amount),
            description,
        });

        setAmount("");
        setDescription("");
    }

    return (
        <div className="mt-4 border-t pt-4">
            <h4 className="font-semibold mb-2">Add Expense</h4>

            <input
                placeholder="Amount €"
                value={amount}
                onChange={(e) => {
                    setAmount(e.target.value);
                    if (error) setError("");
                }}
                className="input mb-2"
            />

            <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="input mb-2"
            />

            {error && (
                <p className="text-sm text-red-500 mb-2">{error}</p>
            )}

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-emerald-500 text-white px-3 py-1 rounded disabled:opacity-50"
            >
                {loading ? "Adding..." : "Add"}
            </button>
        </div>
    );
}