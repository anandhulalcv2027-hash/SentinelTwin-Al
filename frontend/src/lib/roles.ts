import { UserResponse } from '@/types/auth';

export const APP_ROLES = {
  SYSTEM_ADMIN: 'System Administrator',
  ORG_ADMIN: 'Organization Administrator',
  ANALYST: 'Security Analyst',
  EMPLOYEE: 'Employee',
};

export const ROLE_GROUPS = {
  ADMIN: [APP_ROLES.SYSTEM_ADMIN, APP_ROLES.ORG_ADMIN],
  ANALYST: [APP_ROLES.ANALYST],
  VIEWER: [APP_ROLES.EMPLOYEE],
};

export function hasRole(user: UserResponse | null, allowedRoles: string[]): boolean {
  if (!user || !user.roles) return false;
  return user.roles.some((role) => allowedRoles.includes(role));
}

export function isAdmin(user: UserResponse | null): boolean {
  return hasRole(user, ROLE_GROUPS.ADMIN);
}

export function isAnalyst(user: UserResponse | null): boolean {
  return hasRole(user, ROLE_GROUPS.ANALYST);
}

export function isViewer(user: UserResponse | null): boolean {
  return hasRole(user, ROLE_GROUPS.VIEWER);
}
