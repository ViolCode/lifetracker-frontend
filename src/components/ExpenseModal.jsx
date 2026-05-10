import Modal from "./Modal";
import ExpenseSection from "./ExpenseSection";

export default function ExpenseModal({event, expenses, loading, onClose, onReload, onCreate,})
{
    return (
        <Modal onClose={onClose}>
            <div className="mb-4">
                <h2 className="text-xl font-semibold">
                    Expenses
                </h2>

                <p className="text-gray-500 text-sm">
                    {event.title}
                </p>
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