import {Link} from 'react-router-dom';

import type {Internship} from "../mock/internships.mock";

type  Props = {
    internship: Internship;
};

export default function InternshipCard({internship}: Readonly<Props>) {
    return (
        <div
            style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 16,
                margin: "16px 0",
                backgroundColor: "#f9f9f9",
            }}>
            <h3>{internship.title}</h3>
            <p><strong>{internship.companyName}</strong></p>
            <p>{internship.shortDescription}</p>
            <div>
                {internship.technologies.map((tech) => (
                    <span
                        key={tech}
                        style={{
                            marginRight: 8,
                            padding: "2px 6px",
                            backgroundColor: "#eee",
                            borderRadius: 4,
                            fontSize: 12,
                        }}>
                        {tech}
                    </span>
                ))}

                <div style={{marginTop: 8}}>
                    <Link to={`/internships/${internship.id}`}>View Details</Link>
                </div>
            </div>
        </div>

    );
}