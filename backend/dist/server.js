"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const employees_1 = __importDefault(require("./routes/employees"));
const attendance_1 = __importDefault(require("./routes/attendance"));
const payroll_1 = __importDefault(require("./routes/payroll"));
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const auth_1 = __importDefault(require("./routes/auth"));
const profile_1 = __importDefault(require("./routes/profile"));
const auth_2 = require("./middleware/auth");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = Number(process.env.PORT) || 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(auth_2.authenticate);
app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
});
app.use("/api/auth", auth_1.default);
app.use("/api/employees", employees_1.default);
app.use("/api/attendance", attendance_1.default);
app.use("/api/payroll", payroll_1.default);
app.use("/api/profile", profile_1.default);
app.use("/api/dashboard", dashboard_1.default);
app.use((err, _req, res, _next) => {
    console.error(err);
    res
        .status(500)
        .json({ message: err.message || "Terjadi kesalahan pada server" });
});
if (process.env.NODE_ENV !== "test") {
    app.listen(port, () => {
        console.log(`API listening on http://localhost:${port}`);
    });
}
exports.default = app;
//# sourceMappingURL=server.js.map