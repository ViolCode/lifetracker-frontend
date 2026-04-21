const API_URL = "http://localhost:8080/expenses";

export async function getExpenses(eventId) {
    const res = await fetch(`${API_URL}/event/${eventId}`);
    return res.json();
}

export async function createExpense(data) {
    const res = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!res.ok) {
        throw new Error(await res.text());
    }

    return res.json();
}

export async function getAllExpenses() {
    const res = await fetch(`${API_URL}`);
    return res.json();
}