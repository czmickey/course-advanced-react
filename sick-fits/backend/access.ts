import { ListAccessArgs } from "./types";

// access control returns yes/no value depending on the users session
export function isSignedIn({ session }: ListAccessArgs) {
    return !!session;
}