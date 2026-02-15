import {apiFetch} from "./apiFetch";

export type MyInternship = {
    id: number;
    title: string;
    companyName: string;
    description: string;
    technologies: string[];
    myStatus: "APPLIED" | "ACCEPTED" | "REJECTED" | null;
    active: boolean;
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

export async function getMyInternshipsPaged(
    params: {
        page: number,
        size: number,
        q?: string,
        applicationStatus?: "APPLIED" | "ACCEPTED" | "REJECTED"
    },
    signal?: AbortSignal
): Promise<PageDto<MyInternship>> {
    const searchParams = new URLSearchParams();
    searchParams.set("scope", "MY");
    searchParams.set("page", params.page.toString());
    searchParams.set("size", params.size.toString());
    if (params.q && params.q.trim() !== "") searchParams.set("q", params.q);
    if (params.applicationStatus) searchParams.set("applicationStatus", params.applicationStatus);
    return apiFetch<PageDto<MyInternship>>(`/api/internships?${searchParams.toString()}`, {signal});
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
    return apiFetch<PageDto<Internship>>(`/api/internships?${searchParams.toString()}`, {signal});
}

export function getInternship(id: number) {
    return apiFetch<Internship>(`/api/internships/${id}`);
}