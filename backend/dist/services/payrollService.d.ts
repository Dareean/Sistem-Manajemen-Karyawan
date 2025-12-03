import { Prisma } from "@prisma/client";
import { PayrollRunInput } from "../schemas/payrollSchema";
export declare const runPayroll: (payload: PayrollRunInput) => Promise<({
    employee: {
        employeeCode: string;
        fullName: string;
        email: string;
        phone: string | null;
        department: string | null;
        jobTitle: string | null;
        baseSalary: Prisma.Decimal;
        status: string;
        hireDate: Date;
        createdAt: Date;
        updatedAt: Date;
        id: number;
        userId: number | null;
    };
} & {
    status: string;
    id: number;
    overtimeHours: number;
    employeeId: number;
    periodStart: Date;
    periodEnd: Date;
    allowances: Prisma.Decimal;
    deductions: Prisma.Decimal;
    totalHours: number;
    basePay: Prisma.Decimal;
    overtimePay: Prisma.Decimal;
    netPay: Prisma.Decimal;
    generatedAt: Date;
})[]>;
//# sourceMappingURL=payrollService.d.ts.map