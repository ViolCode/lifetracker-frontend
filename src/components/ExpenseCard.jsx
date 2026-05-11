import { formatDate } from "../utils/format";
import { deleteExpense } from "../api/expenses";

export default function ExpenseCard({
                                        expense,
                                        onDeleted,
                                    }) {

    async function handleDelete() {

        const confirmed = window.confirm(
            "Delete this expense?"
        );

        if (!confirmed) {
            return;
        }

        await deleteExpense(expense.id);

        onDeleted();
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
            </div>

            <div className="text-right">

                <div className="text-xs text-gray-500">
                    {formatDate(expense.createdAt)}
                </div>

                <button
                    onClick={handleDelete}
                    className="text-xs text-red-500 mt-2">
                    Delete
                </button>

            </div>
        </div>
    );
}