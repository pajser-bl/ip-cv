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
    companyName: string;
    technologies: string[];
    startDate: string;
    endDate: string;
    additionalRequirements: string;
    active: boolean;
    createdAt: string;
    modifiedAt: string;
};

export type PageDto<T> = {
    items: T[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
};

export function getMyInternships() {
    return apiFetch<MyInternship[]>("/api/students/me/internships");
}

export async function getInternshipsPaged(
    params: {
        page: number,
        size: number,
        q?: string,
        tech?: string
    },
    signal?: AbortSignal
): Promise<PageDto<Internship>> {
    const searchParams = new URLSearchParams();
    searchParams.set("page", params.page.toString());
    searchParams.set("size", params.size.toString());
    if (params.q && params.q.trim() !== "") searchParams.set("q", params.q);
    if (params.tech && params.tech.trim() !== "") searchParams.set("tech", params.tech);
    return apiFetch<PageDto<Internship>>(`/api/internships?${searchParams.toString()}`, {signal});
}

export function getInternship(id: number) {
    return apiFetch<Internship>(`/api/internships/${id}`);
}