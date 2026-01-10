import {Link} from 'react-router-dom';

export default function InternshipsPage() {
    const hasAnyInternships = false;
    const isCvIncomplete = true;

    return (
        <div>
            <h1>My Internships</h1>
            {isCvIncomplete && (
                <div style={{padding: 12, border: "1px solid #ccc", borderRadius: 8}}>
                    <strong>Your CV is incomplete.</strong>
                    <div style={{marginTop: 8}}>
                        <Link to="/profile">Complete your CV</Link>
                    </div>
                </div>
            )}

            <div style={{marginTop: 16}}>
                {hasAnyInternships ? (
                    <p>Show my internships here</p>
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
