import {apiFetch} from "./apiFetch";

export type MyInternship = {
    internshipId: number;
    title: string;
    companyName: string;
    technologies: string[];
    status: "APPLIED" | "ACCEPTED" | "REJECTED";
};


export type Internship = {
    id: number;
    title: string;
    description: string;
    technologies: string;
    startDate: string;
    endDate: string;
    additionalRequirements: string;
    active: boolean;
    createdAt: string;
    modifiedAt: string;
};

export function getMyInternships() {
    return apiFetch<MyInternship[]>("/api/students/me/internships");
}


export function getInternships() {
    return apiFetch<Internship[]>("/api/internships");
}