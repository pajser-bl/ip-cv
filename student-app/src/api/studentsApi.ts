import {apiFetch} from "./apiFetch";


export type MeResponse = {
    sub: string;
    username?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
};

export function getMe() {
    return apiFetch<MeResponse>("/api/students/me");
}