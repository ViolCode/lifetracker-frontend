import ExpenseCard from "./ExpenseCard";

export default function ExpenseList({
                                        expenses,
                                        onDeleted,
                                    }) {
    if (expenses.length === 0) {
        return (
            <p className="text-sm text-gray-500">
                No expenses yet.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {expenses.map(expense => (
                <ExpenseCard
                    key={expense.id}
                    expense={expense}
                    onDeleted={onDeleted}
                />
            ))}
        </div>
    );
}