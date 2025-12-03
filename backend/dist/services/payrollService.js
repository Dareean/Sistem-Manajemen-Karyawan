"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPayroll = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
const BASE_MONTHLY_HOURS = 173;
const OVERTIME_MULTIPLIER = 1.5;
const toDecimal = (value) => new client_1.Prisma.Decimal(value ?? 0);
const runPayroll = async (payload) => {
    const periodStart = new Date(payload.periodStart);
    const periodEnd = new Date(payload.periodEnd);
    const employees = await prisma_1.default.employee.findMany({
        where: payload.employeeId ? { id: payload.employeeId } : {},
    });
    if (!employees.length) {
        throw new Error("Tidak ada karyawan yang ditemukan untuk periode ini");
    }
    const createdRuns = [];
    for (const employee of employees) {
        const logs = await prisma_1.default.attendanceLog.findMany({
            where: {
                employeeId: employee.id,
                attendanceDate: {
                    gte: periodStart,
                    lte: periodEnd,
                },
            },
        });
        const totalHours = logs.reduce((acc, log) => acc + (log.workHours ?? 0), 0);
        const overtimeHours = logs.reduce((acc, log) => acc + (log.overtimeHours ?? 0), 0);
        const basePay = toDecimal(employee.baseSalary);
        const hourlyRate = basePay.div(BASE_MONTHLY_HOURS);
        const overtimePay = hourlyRate.mul(overtimeHours).mul(OVERTIME_MULTIPLIER);
        const allowances = toDecimal(payload.allowances);
        const deductions = toDecimal(payload.deductions);
        const netPay = basePay.plus(overtimePay).plus(allowances).minus(deductions);
        const payroll = await prisma_1.default.payrollRun.create({
            data: {
                employeeId: employee.id,
                periodStart,
                periodEnd,
                totalHours,
                overtimeHours,
                basePay,
                overtimePay,
                allowances,
                deductions,
                netPay,
                status: "PENDING",
            },
            include: { employee: true },
        });
        createdRuns.push(payroll);
    }
    return createdRuns;
};
exports.runPayroll = runPayroll;
//# sourceMappingURL=payrollService.js.map