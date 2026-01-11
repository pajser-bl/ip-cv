import {internships} from "../mock/internships.mock";
import InternshipCard from "../components/InternshipCard";

export default function InternshipsPage() {
    return (
        <div>
            <h1>Internships</h1>
            <div
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: 16,
                }}>
                {internships.map((internship) => (
                    <InternshipCard key={internship.id} internship={internship}/>
                ))}
            </div>
        </div>

    );
}
