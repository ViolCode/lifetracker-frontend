export function calculateMonthlyExpenses(expenses = []) {

    const now = new Date();

    return expenses.reduce((total, expense) => {

        const date = new Date(expense.createdAt);

        const sameMonth =
            date.getMonth() === now.getMonth();

        const sameYear =
            date.getFullYear() === now.getFullYear();

        if (sameMonth && sameYear) {
            return total + expense.amount;
        }

        return total;

    }, 0);
}

export function calculateWeeklyExpenses(expenses = []) {

    const now = new Date();

    const currentDay = now.getDay();

    const diffToMonday =
        currentDay === 0
            ? -6
            : 1 - currentDay;

    const monday = new Date(now);

    monday.setDate(
        now.getDate() + diffToMonday
    );

    monday.setHours(0, 0, 0, 0);

    const sunday = new Date(monday);

    sunday.setDate(
        monday.getDate() + 6
    );

    sunday.setHours(23, 59, 59, 999);

    return expenses.reduce((total, expense) => {

        const date = new Date(expense.createdAt);

        if (date >= monday && date <= sunday) {
            return total + expense.amount;
        }

        return total;

    }, 0);
}