import type { User, Employee } from "@prisma/client";
export declare const mapUserResponse: (user: User & {
    employee?: Employee | null;
}) => {
    id: number;
    email: string;
    role: string;
    employee: {
        id: number;
        employeeCode: string;
        fullName: string;
        email: string;
        phone: string | null;
        department: string | null;
        jobTitle: string | null;
        baseSalary: import("@prisma/client/runtime/library").Decimal;
        status: string;
    } | null;
};
//# sourceMappingURL=userMapper.d.ts.map