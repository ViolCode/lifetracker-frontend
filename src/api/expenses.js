import { api } from "./client";

export const getExpenses = (eventId) =>
    api(`/expenses/event/${eventId}`);

export const getAllExpenses = () =>
    api("/expenses");

export const createExpense = (data) =>
    api("/expenses", {
        method: "POST",
        body: JSON.stringify(data),
    });

export const deleteExpense = (id) =>
    api(`/expenses/${id}`, {
        method: "DELETE",
    });