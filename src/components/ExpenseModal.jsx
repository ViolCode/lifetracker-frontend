import Modal from "./Modal";
import ExpenseSection from "./ExpenseSection";

export default function ExpenseModal({event, expenses, loading, onClose, onReload, onCreate})
{
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);

    return (
        <Modal onClose={onClose}>
            <div className="mb-4">
                <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-semibold">
                            Expenses
                        </h2>

                        <p className="text-gray-500 text-sm">
                            {event.title}
                        </p>
                    </div>

                    <div className="text-right">
                        <div className="text-xs text-gray-400">Total</div>
                        <div className="text-lg font-bold text-blue-600">
                            €{total.toFixed(2)}
                        </div>
                    </div>
                </div>
            </div>

            <ExpenseSection
                expenses={expenses}
                onDeleted={onReload}
                onCreate={onCreate}
                loading={loading}
            />

            <div className="flex justify-end mt-6">
                <button
                    onClick={onClose}
                    className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300"
                >
                    Close
                </button>
            </div>
        </Modal>
    );
}