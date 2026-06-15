const BASE_URL = import.meta.env.VITE_API_URL;

export async function api(url, options = {}) {
    const response = await fetch(
        `${BASE_URL}${url}`,
        {
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...options.headers,
            },
            ...options,
        }
    );

    if (response.status === 403) {
        localStorage.removeItem("user");
        window.location.href = "/login";
        throw new Error("Session expired. Please login again.");
    }

    if (!response.ok) {
        let message = "Request failed";
        try {
            const errorData = await response.json();
            message = errorData.error || message;
        } catch {
            //
        }
        throw new Error(message);
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