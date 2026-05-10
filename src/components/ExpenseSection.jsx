import ExpenseList from "./ExpenseList";
import ExpenseForm from "./ExpenseForm";

export default function ExpenseSection({
                                           expenses,
                                           onDeleted,
                                           onCreate,
                                           loading,
                                       }) {
    return (
        <div className="space-y-4">
            <ExpenseList
                expenses={expenses}
                onDeleted={onDeleted}
            />

            <ExpenseForm
                onSubmit={onCreate}
                loading={loading}
            />
        </div>
    );
}