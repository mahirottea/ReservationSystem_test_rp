export type Role = "admin" | "user" | "staff";
export type SubRole = "manager" | "staff" | "cashier" | "basic";

export interface JwtPayload {
  role: Role;
  tenantId: string;
}
