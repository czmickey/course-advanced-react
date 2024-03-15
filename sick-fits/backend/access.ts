import { permissionsList } from "./schemas/fields";
import { ListAccessArgs } from "./types";

// access control returns yes/no value depending on the users session
export function isSignedIn({ session }: ListAccessArgs) {
    return !!session;
}

const generatedPermissions = Object.fromEntries(
    permissionsList.map(permission => [
        permission,
        function ({ session }: ListAccessArgs) {
            return !!session?.data.role?.[permission];
        },
    ])
);

// permissions check if someone meets the criteria
export const permissions = {
    ...generatedPermissions
};