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

// rule based permissions
// rules can return a boolean - yes or no - or a filter which limits which products they can CRUD
export const rules = {
    canManageProducts({ session }: ListAccessArgs) {
        // 1. Do they have the permission of canManageProducts
        if (permissions.canManageProducts({ session })) {
            return true;
        }
        // 2. if not, do they own this item?
        return { user: { id: session.itemId } };
    },
    canOrder({ session }: ListAccessArgs) {
        if (!isSignedIn({ session })) {
            return false;
        }

        // 1. Do they have the permission of canManageProducts
        if (permissions.canManageCart({ session })) {
            return true;
        }
        // 2. if not, do they own this item?
        return { user: { id: session.itemId } };
    },
    canManageOrderItems({ session }: ListAccessArgs) {
        // 1. Do they have the permission of canManageProducts
        if (permissions.canManageCart({ session })) {
            return true;
        }
        // 2. if not, do they own this item?
        return { order: { user: { id: session.itemId } } };
    },
    canReadProducts({ session }: ListAccessArgs) {
        if (permissions.canManageProducts({ session })) {
            return true; // can read everything
        }

        // should see only available products (base od the status field)
        return { status: 'AVAILABLE' };
    },
};