interface Permission {
    resource: string;
    actions: string[];
}
export declare class RbacService {
    private readonly permissions;
    canAccess(userRole: string, resource: string, action: string): boolean;
    getPermissions(userRole: string): Permission[];
    hasRole(userRole: string, requiredRoles: string[]): boolean;
    canAccessResource(userRole: string, resource: string, action: string, ownerId?: string, userId?: string): boolean;
}
export {};
