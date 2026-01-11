export type Internship = {
    id: string;
    title: string;
    companyName: string;
    shortDescription: string;
    description: string;
    technologies: string[];
};

export const internships: Internship[] = [
    {
        id: "1",
        title: "Backend Developer Intern",
        companyName: "Pure Storage",
        shortDescription: "Work on Spring Boot services and APIs.",
        description:
            "You will work on real backend services using Spring Boot, PostgreSQL and REST APIs.",
        technologies: ["Java", "Spring", "PostgreSQL"],
    },
    {
        id: "2",
        title: "Frontend Developer Intern",
        companyName: "Startup XYZ",
        shortDescription: "Build React-based user interfaces.",
        description:
            "You will build modern web interfaces using React and TypeScript.",
        technologies: ["React", "TypeScript", "CSS"],
    },
];
