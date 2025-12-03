"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapUserResponse = void 0;
const mapUserResponse = (user) => ({
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
exports.mapUserResponse = mapUserResponse;
//# sourceMappingURL=userMapper.js.map