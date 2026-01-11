import {useParams} from 'react-router-dom';
import {useState} from "react";

import {internships} from "../mock/internships.mock";


export default function InternshipDetailsPage() {
    const {id} = useParams<{ id: string }>();
    const internship = internships.find((i) => i.id === id);
    const [isApplied, setIsApplied] = useState(false);

    if (!internship) {
        return <p>Internship not found</p>;
    }

    return (
        <div>
            <h1>{internship.title}</h1>
            <h3>{internship.companyName}</h3>
            <p>{internship.description}</p>
            <h4>Technologies</h4>
            <ul>
                {internship.technologies.map((tech) => (
                    <li key={tech}>{tech}</li>
                ))}
            </ul>
            <button onClick={() => setIsApplied(true)} disabled={isApplied}>
                {isApplied ? "Applied" : "Apply"}
            </button>
        </div>
    );
}
