import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getMyInternships, type MyInternship } from "../api/internshipsApi";

export default function InternshipsPage() {
    const [items, setItems] = useState<MyInternship[] | null>(null);
    const [error, setError] = useState<string | null>(null);

    // TODO: later replace with real CV endpoint
    const isCvIncomplete = true;

    useEffect(() => {
        getMyInternships()
            .then(setItems)
            .catch((e) => setError(e instanceof Error ? e.message : String(e)));
    }, []);

    const grouped = useMemo(() => {
        const accepted: MyInternship[] = [];
        const applied: MyInternship[] = [];
        const rejected: MyInternship[] = [];

        (items ?? []).forEach((x) => {
            if (x.status === "ACCEPTED") accepted.push(x);
            else if (x.status === "APPLIED") applied.push(x);
            else rejected.push(x);
        });

        return { accepted, applied, rejected };
    }, [items]);

    if (error) {
        return <p style={{ color: "crimson" }}>{error}</p>;
    }

    if (items === null) {
        return <p>Loading…</p>;
    }

    const hasAnyInternships = items.length > 0;

    return (
        <div>
            <h1>My Internships</h1>

            {isCvIncomplete && (
                <div style={{ padding: 12, border: "1px solid #ccc", borderRadius: 8 }}>
                    <strong>Your CV is incomplete.</strong>
                    <div style={{ marginTop: 8 }}>
                        <Link to="/profile">Complete your CV</Link>
                    </div>
                </div>
            )}

            <div style={{ marginTop: 16 }}>
                {hasAnyInternships ? (
                    <div>
                        {grouped.accepted.length > 0 && (
                            <section style={{marginTop: 12}}>
                                <h2>Accepted / Active</h2>
                                {grouped.accepted.map((x) => (
                                    <div
                                        key={x.internshipId}
                                        style={{padding: 12, border: "1px solid #ccc", borderRadius: 8, marginTop: 8}}
                                    >
                                        <strong>{x.title}</strong> — {x.companyName}
                                        {x.technologies.length > 0 && (
                                            <div style={{marginTop: 6, fontSize: 12, opacity: 0.8}}>
                                                Tech: {x.technologies.join(", ")}
                                            </div>
                                        )}
                                        <div style={{marginTop: 8}}>
                                            <Link to={`/internships/${x.internshipId}`}>Open details</Link>
                                        </div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {grouped.applied.length > 0 && (
                            <section style={{marginTop: 12}}>
                                <h2>Applied</h2>
                                {grouped.applied.map((x) => (
                                    <div
                                        key={x.internshipId}
                                        style={{padding: 12, border: "1px solid #ccc", borderRadius: 8, marginTop: 8}}
                                    >
                                        <strong>{x.title}</strong> — {x.companyName}
                                        <div style={{marginTop: 6, fontSize: 12, opacity: 0.8}}>Status: APPLIED</div>
                                    </div>
                                ))}
                            </section>
                        )}

                        {grouped.rejected.length > 0 && (
                            <section style={{marginTop: 12}}>
                                <h2>Rejected</h2>
                                {grouped.rejected.map((x) => (
                                    <div
                                        key={x.internshipId}
                                        style={{padding: 12, border: "1px solid #ccc", borderRadius: 8, marginTop: 8}}
                                    >
                                        <strong>{x.title}</strong> — {x.companyName}
                                        <div style={{marginTop: 6, fontSize: 12, opacity: 0.8}}>Status: REJECTED</div>
                                    </div>
                                ))}
                            </section>
                        )}
                    </div>
                ) : (
                    <div style={{padding: 12, border: "1px solid #ccc", borderRadius: 8}}>
                        <strong>You don't have any internships yet.</strong>
                        <div style={{marginTop: 8}}>
                            <Link to="/internships">Browse all internships</Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
