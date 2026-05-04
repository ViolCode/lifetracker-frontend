export default function ExpenseList({ expenses, onEdit }) {
    return (
        <div>
            {expenses.map(e => (
                <div
                    key={e.id}
                    onClick={() => onEdit(e)}
                    className="text-sm mb-1 cursor-pointer hover:bg-gray-100 p-1 rounded"
                >
                    €{e.amount} — {e.description}
                </div>
            ))}
        </div>
    );
}