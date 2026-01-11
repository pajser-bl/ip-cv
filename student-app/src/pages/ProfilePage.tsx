import { useEffect, useState } from "react";
import { getMe, type MeResponse } from "../api/studentsApi";

export default function ProfilePage() {
    const [me, setMe] = useState<MeResponse | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        getMe()
            .then(setMe)
            .catch((e) => setError(e.message));
    }, []);

    if (error) {
        return <p style={{ color: "crimson" }}>{error}</p>;
    }

    if (!me) {
        return <p>Loading…</p>;
    }

    return (
        <div>
            <h1>Profile / CV</h1>

            <div style={{ padding: 12, border: "1px solid #ccc", borderRadius: 8 }}>
                <p><strong>Username:</strong> {me.username}</p>
                <p><strong>Email:</strong> {me.email}</p>
                <p>
                    <strong>Name:</strong> {me.firstName} {me.lastName}
                </p>
                <p><strong>Keycloak ID:</strong> {me.sub}</p>
            </div>
        </div>
    );
}
