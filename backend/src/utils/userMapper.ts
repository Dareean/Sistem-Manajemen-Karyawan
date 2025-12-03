import type { User, Employee } from "@prisma/client";

export const mapUserResponse = (
  user: User & { employee?: Employee | null }
) => ({
  id: user.id,
  email: user.email,
  role: user.role,
  employee: user.employee
    ? {
        id: user.employee.id,
        employeeCode: user.employee.employeeCode,
        fullName: user.employee.fullName,
        email: user.employee.email,
        phone: user.employee.phone,
        department: user.employee.department,
        jobTitle: user.employee.jobTitle,
        baseSalary: user.employee.baseSalary,
        status: user.employee.status,
      }
    : null,
});
