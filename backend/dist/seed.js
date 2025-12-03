"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("./lib/prisma"));
const employees = [
    {
        employeeCode: "KRY-001",
        fullName: "Dewi Anggraini",
        email: "dewi.anggraini@example.com",
        department: "Operasional",
        jobTitle: "Supervisor",
        baseSalary: new client_1.Prisma.Decimal(9000000),
    },
    {
        employeeCode: "KRY-002",
        fullName: "Andi Pratama",
        email: "andi.pratama@example.com",
        department: "Finance",
        jobTitle: "Staff Payroll",
        baseSalary: new client_1.Prisma.Decimal(6500000),
    },
    {
        employeeCode: "KRY-003",
        fullName: "Siti Rahma",
        email: "siti.rahma@example.com",
        department: "IT",
        jobTitle: "Full Stack Developer",
        baseSalary: new client_1.Prisma.Decimal(10000000),
    },
];
const seed = async () => {
    console.info("Seeding database...");
    await prisma_1.default.payrollRun.deleteMany();
    await prisma_1.default.attendanceLog.deleteMany();
    await prisma_1.default.employee.deleteMany();
    for (const data of employees) {
        await prisma_1.default.employee.create({
            data,
        });
    }
    const createdEmployees = await prisma_1.default.employee.findMany();
    const today = new Date();
    for (const employee of createdEmployees) {
        for (let i = 0; i < 5; i += 1) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const checkIn = new Date(date);
            checkIn.setHours(9, 0, 0, 0);
            const checkOut = new Date(date);
            checkOut.setHours(17, 0, 0, 0);
            await prisma_1.default.attendanceLog.create({
                data: {
                    employeeId: employee.id,
                    attendanceDate: date,
                    checkIn,
                    checkOut,
                    workHours: 8,
                    overtimeHours: i % 2 === 0 ? 1 : 0,
                    status: "PRESENT",
                },
            });
        }
    }
    console.info("Seeding selesai");
};
seed()
    .catch((error) => {
    console.error(error);
    process.exit(1);
})
    .finally(async () => {
    await prisma_1.default.$disconnect();
});
//# sourceMappingURL=seed.js.map