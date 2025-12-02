import useAuth from './useAuth';

export function usePermission() {
    const { user } = useAuth();

    const can = (resource, action) => {
        // Super Admin bypass (optional, if you have a specific super admin role name)
        // if (user?.role?.name === 'Super Admin') return true;

        if (!user || !user.Role || !user.Role.permissions) {
            return false;
        }

        const permissionString = `${resource}:${action}`;
        return user.Role.permissions.includes(permissionString);
    };

    const hasRole = (roleName) => {
        return user?.Role?.name === roleName;
    };

    return { can, hasRole, user };
}
