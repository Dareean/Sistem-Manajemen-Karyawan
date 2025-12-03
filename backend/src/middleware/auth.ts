import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

export interface AuthUser {
  userId: number;
  role: string;
  employeeId?: number | null;
}

export const createToken = (payload: AuthUser) =>
  jwt.sign(payload, JWT_SECRET, { expiresIn: "8h" });

export const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const header = req.headers.authorization;
  if (!header) {
    return next();
  }

  const [, token] = header.split(" ");
  if (!token) {
    return next();
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;
    req.user = decoded;
  } catch (error) {
    console.warn("Invalid JWT", error);
  }

  next();
};

export const requireAuth = (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!_req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }
  return next();
};

export const requireRole =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Authentication required" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Anda tidak memiliki akses" });
    }

    return next();
  };

export const ensureEmployeeContext = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.user?.employeeId) {
    return res.status(403).json({ message: "Akses karyawan diperlukan" });
  }
  return next();
};
