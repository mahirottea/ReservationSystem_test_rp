import { JwtPayload } from 'jsonwebtoken';

declare module 'express' {
  export interface Request {
    user?: JwtPayload & { userId: string; tenantId: string; sub: string; role?: string; subRole?: string };
  }
}