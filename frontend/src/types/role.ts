export interface Role {
  id: string;
  name: string;
  description: string;
}

export interface RoleListResponse {
  items: Role[];
  total: number;
}
