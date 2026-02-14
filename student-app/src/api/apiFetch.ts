import keycloak  from "../auth/keycloak";

const API_BASE_URL = "http://localhost:8081";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    await keycloak.updateToken(30);

    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${keycloak.token}`);
    headers.set("Content-Type", "application/json");

    let response: Response;
    try {
        response = await fetch(`${API_BASE_URL}${path}`, {
            ...init,
            headers,
        });
    } catch (e) {
        if (e instanceof DOMException && e.name === "AbortError") throw e;
        if (e instanceof Error && e.name === "AbortError") throw e;
        throw e;
    }

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status} - ${text}`);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
}