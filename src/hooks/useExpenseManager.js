import { useState } from "react";
import { getExpenses, createExpense } from "../api/expenses";
import toast from "react-hot-toast";

export function useExpenseManager(onExpenseCreated) {

    const [showExpenses, setShowExpenses] = useState(false);
    const [expenseEvent, setExpenseEvent] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);

    async function openExpenses(event) {
        const data = await getExpenses(event.id);

        setExpenses(data);
        setExpenseEvent(event);
        setShowExpenses(true);
    }

    async function reloadExpenses() {

        if (!expenseEvent) {
            return;
        }

        const data = await getExpenses(
            expenseEvent.id
        );

        setExpenses(data);
    }

    async function addExpense(data) {

        if (!expenseEvent) {
            return;
        }

        try {

            setLoading(true);

            await createExpense({
                eventId: expenseEvent.id,
                ...data,
            });

            await reloadExpenses();

            if (onExpenseCreated) {
                await onExpenseCreated();
            }

            toast.success("Expense added");

        } catch (e) {

            toast.error(e.message);

        } finally {

            setLoading(false);
        }
    }

    function closeExpenses() {

        setShowExpenses(false);

        setExpenseEvent(null);

        setExpenses([]);
    }

    return {
        showExpenses,
        expenseEvent,
        expenses,
        loading,

        openExpenses,
        closeExpenses,
        reloadExpenses,
        addExpense,
    };
}