import { Prisma } from "@prisma/client";
import prisma from "./lib/prisma";
import bcrypt from "bcryptjs";

const employees = [
  {
    employeeCode: "KRY-001",
    fullName: "Dewi Anggraini",
    email: "dewi.anggraini@example.com",
    department: "Operasional",
    jobTitle: "Supervisor",
    baseSalary: new Prisma.Decimal(9000000),
  },
  {
    employeeCode: "KRY-002",
    fullName: "Andi Pratama",
    email: "andi.pratama@example.com",
    department: "Finance",
    jobTitle: "Staff Payroll",
    baseSalary: new Prisma.Decimal(6500000),
  },
  {
    employeeCode: "KRY-003",
    fullName: "Siti Rahma",
    email: "siti.rahma@example.com",
    department: "IT",
    jobTitle: "Full Stack Developer",
    baseSalary: new Prisma.Decimal(10000000),
  },
];

const seed = async () => {
  console.info("Seeding database...");

  await prisma.payrollRun.deleteMany();
  await prisma.attendanceLog.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.user.deleteMany();

  const adminPassword = await bcrypt.hash("PasswordRahasia123", 10);

  await prisma.user.create({
    data: {
      email: "admin@example.com",
      passwordHash: adminPassword,
      role: "ADMIN",
      employee: {
        create: {
          employeeCode: "ADM-001",
          fullName: "Administrator",
          email: "admin@example.com",
          department: "Manajemen",
          jobTitle: "Administrator",
          baseSalary: new Prisma.Decimal(0),
        },
      },
    },
  });

  for (const data of employees) {
    await prisma.employee.create({
      data,
    });
  }

  const createdEmployees = await prisma.employee.findMany();
  const today = new Date();

  for (const employee of createdEmployees) {
    for (let i = 0; i < 5; i += 1) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const checkIn = new Date(date);
      checkIn.setHours(9, 0, 0, 0);
      const checkOut = new Date(date);
      checkOut.setHours(17, 0, 0, 0);

      await prisma.attendanceLog.create({
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
    await prisma.$disconnect();
  });
