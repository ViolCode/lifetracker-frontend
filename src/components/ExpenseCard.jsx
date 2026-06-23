import { formatDate } from "../utils/format";
import { deleteExpense } from "../api/expenses";
import toast from "react-hot-toast";

export default function ExpenseCard({ expense, onDeleted }) {

    async function handleDelete() {
        const confirmed = window.confirm("Delete this expense?");
        if (!confirmed) return;

        try {
            await deleteExpense(expense.id);
            onDeleted();
            toast.success("Expense deleted.");
        } catch (e) {
            toast.error(`Could not delete this expense. ${e.message}`);
        }
    }

    return (
        <div className="bg-gray-50 border rounded-xl p-3 flex justify-between items-start">
            <div>
                <div className="font-semibold">
                    €{expense.amount}
                </div>

                <div className="text-sm text-gray-600 mt-1">
                    {expense.description || "No description"}
                </div>

                {expense.addedByName && (
                    <div className="text-xs text-gray-400 mt-1">
                        Added by {expense.addedByName}
                    </div>
                )}
            </div>

            <div className="text-right">
                <div className="text-xs text-gray-500">
                    {formatDate(expense.createdAt)}
                </div>

                <button
                    onClick={handleDelete}
                    className="text-xs text-red-500 mt-2"
                >
                    Delete
                </button>
            </div>
        </div>
    );
}