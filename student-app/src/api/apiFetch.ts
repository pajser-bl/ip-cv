import keycloak  from "../auth/keycloak";

const API_BASE_URL = "http://localhost:8081";

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
    await keycloak.updateToken(30);

    const headers = new Headers(init?.headers);
    headers.set("Authorization", `Bearer ${keycloak.token}`);
    headers.set("Content-Type", "application/json");

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...init,
        headers,
    });

    if (!response.ok) {
        const text = await response.text().catch(() => "");
        throw new Error(`HTTP ${response.status} - ${text}`);
    }

    return (await response.json() as T);
}