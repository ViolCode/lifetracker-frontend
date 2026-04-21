const BASE_URL = "http://localhost:8080";

export async function request(url, options = {}) {
    const res = await fetch(BASE_URL + url, {
        headers: {
            "Content-Type": "application/json",
            ...options.headers,
        },
        ...options,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "API error");
    }

    return res.json();
}