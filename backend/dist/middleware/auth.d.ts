import type { NextFunction, Request, Response } from "express";
export interface AuthUser {
    userId: number;
    role: string;
    employeeId?: number | null;
}
export declare const createToken: (payload: AuthUser) => string;
export declare const authenticate: (req: Request, _res: Response, next: NextFunction) => void;
export declare const requireAuth: (_req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const requireRole: (roles: string[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
export declare const ensureEmployeeContext: (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=auth.d.ts.map