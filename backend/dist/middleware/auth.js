"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureEmployeeContext = exports.requireRole = exports.requireAuth = exports.authenticate = exports.createToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined in environment variables");
}
const createToken = (payload) => jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: "8h" });
exports.createToken = createToken;
const authenticate = (req, _res, next) => {
    const header = req.headers.authorization;
    if (!header) {
        return next();
    }
    const [, token] = header.split(" ");
    if (!token) {
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        req.user = decoded;
    }
    catch (error) {
        console.warn("Invalid JWT", error);
    }
    next();
};
exports.authenticate = authenticate;
const requireAuth = (_req, res, next) => {
    if (!_req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    return next();
};
exports.requireAuth = requireAuth;
const requireRole = (roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Authentication required" });
    }
    if (!roles.includes(req.user.role)) {
        return res.status(403).json({ message: "Anda tidak memiliki akses" });
    }
    return next();
};
exports.requireRole = requireRole;
const ensureEmployeeContext = (req, res, next) => {
    if (!req.user?.employeeId) {
        return res.status(403).json({ message: "Akses karyawan diperlukan" });
    }
    return next();
};
exports.ensureEmployeeContext = ensureEmployeeContext;
//# sourceMappingURL=auth.js.map