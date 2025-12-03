import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { PayrollRunInput } from "../schemas/payrollSchema";

const BASE_MONTHLY_HOURS = 173;
const OVERTIME_MULTIPLIER = 1.5;

const toDecimal = (value: number | string | Prisma.Decimal | undefined) =>
  new Prisma.Decimal(value ?? 0);

export const runPayroll = async (payload: PayrollRunInput) => {
  const periodStart = new Date(payload.periodStart);
  const periodEnd = new Date(payload.periodEnd);
  const employees = await prisma.employee.findMany({
    where: payload.employeeId ? { id: payload.employeeId } : {},
  });

  if (!employees.length) {
    throw new Error("Tidak ada karyawan yang ditemukan untuk periode ini");
  }

  const createdRuns = [];

  for (const employee of employees) {
    const logs = await prisma.attendanceLog.findMany({
      where: {
        employeeId: employee.id,
        attendanceDate: {
          gte: periodStart,
          lte: periodEnd,
        },
      },
    });

    const totalHours = logs.reduce((acc, log) => acc + (log.workHours ?? 0), 0);
    const overtimeHours = logs.reduce(
      (acc, log) => acc + (log.overtimeHours ?? 0),
      0
    );

    const basePay = toDecimal(employee.baseSalary);
    const hourlyRate = basePay.div(BASE_MONTHLY_HOURS);
    const overtimePay = hourlyRate.mul(overtimeHours).mul(OVERTIME_MULTIPLIER);
    const allowances = toDecimal(payload.allowances);
    const deductions = toDecimal(payload.deductions);
    const netPay = basePay.plus(overtimePay).plus(allowances).minus(deductions);

    const payroll = await prisma.payrollRun.create({
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
