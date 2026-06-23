const BASE_URL = import.meta.env.VITE_API_URL;

export async function api(url, options = {}) {
    let response;
    try {
        response = await fetch(`${BASE_URL}${url}`, {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        });
    } catch {
        throw new Error("Cannot reach the server. Check your internet connection.");
    }

    if (response.status === 403) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Your session has expired. Please log in again.");
    }

    if (!response.ok) {
        let message;
        try {
            const errorData = await response.json();
            message = errorData.error;
        } catch {
            //
        }

        if (!message) {
            message = statusMessage(response.status);
        }

        const err = new Error(message);
        err.status = response.status;
        throw err;
    }

    if (response.status === 204) return null;

    const text = await response.text();
    if (!text) return null;

    return JSON.parse(text);
}

function statusMessage(status) {
    if (status === 400) return "Invalid request. Please check your input.";
    if (status === 401) return "Wrong email or password.";
    if (status === 404) return "Not found.";
    if (status === 409) return "This already exists.";
    if (status >= 500) return "Server error. Please try again later.";
    return "Unexpected error. Please try again.";
}