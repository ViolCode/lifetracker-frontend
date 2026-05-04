import ExpenseList from "./ExpenseList";
import AddExpenseForm from "./AddExpenseForm";

export default function ExpenseSection({ expenses, eventId, onCreated, onEdit }) {
    return (
        <div className="mt-6">
            <h3 className="font-semibold mb-2">Expenses</h3>

            <ExpenseList
                expenses={expenses}
                onEdit={onEdit}
            />

            <AddExpenseForm
                eventId={eventId}
                onCreated={onCreated}
            />
        </div>
    );
}