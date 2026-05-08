const BASE_URL = "http://localhost:8080";

export async function api(url, options = {}) {
    const response = await fetch(`${BASE_URL}${url}`, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Request failed");
    }

    if (response.status === 204) {
        return null;
    }

    const text = await response.text();

    if (!text) {
        return null;
    }

    return JSON.parse(text);
}