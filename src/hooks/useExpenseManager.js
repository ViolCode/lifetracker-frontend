import { useState } from "react";
import { getExpenses, createExpense } from "../api/expenses";

export function useExpenseManager(onExpenseCreated) {
    const [showExpenses, setShowExpenses] = useState(false);
    const [expenseEvent, setExpenseEvent] = useState(null);
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(false);

    async function openExpenses(event) {
        try {
            setLoading(true);
            const data = await getExpenses(event.id);
            setExpenses(data);
            setExpenseEvent(event);
            setShowExpenses(true);
        } catch (error) {
            // error handled silently
        } finally {
            setLoading(false);
        }
    }

    async function reloadExpenses() {
        if (!expenseEvent) {
            return;
        }

        try {
            const data = await getExpenses(expenseEvent.id);
            setExpenses(data);
        } catch (error) {
            // error handled silently
        }
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
        } catch (e) {
            // error handled silently
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