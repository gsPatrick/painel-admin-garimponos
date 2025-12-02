"use client";

import { usePermission } from "@/hooks/usePermission";

export function PermissionGuard({ resource, action, children, fallback = null }) {
    const { can } = usePermission();

    if (!can(resource, action)) {
        return fallback;
    }

    return <>{children}</>;
}
