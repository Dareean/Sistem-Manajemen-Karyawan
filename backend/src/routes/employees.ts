import { Router } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { employeeSchema } from "../schemas/employeeSchema";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth, requireRole(["ADMIN"]));

router.get("/", async (req, res, next) => {
  try {
    const search = (req.query.search as string | undefined)?.trim();
    const filters = search
      ? {
          OR: [
            { fullName: { contains: search, mode: "insensitive" } },
            { employeeCode: { contains: search, mode: "insensitive" } },
            { department: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const employees = await prisma.employee.findMany({
      where: filters,
      orderBy: { createdAt: "desc" },
    });

    res.json(employees);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const parsed = employeeSchema.parse(req.body);
    const employee = await prisma.employee.create({
      data: {
        ...parsed,
        baseSalary: new Prisma.Decimal(parsed.baseSalary ?? 0),
        hireDate: parsed.hireDate ? new Date(parsed.hireDate) : new Date(),
        phone: parsed.phone || null,
        department: parsed.department || null,
        jobTitle: parsed.jobTitle || null,
        status: parsed.status ?? "ACTIVE",
      },
    });

    res.status(201).json(employee);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  try {
    const employeeId = Number(req.params.id);
    const parsed = employeeSchema.partial().parse(req.body);

    const data: Prisma.EmployeeUpdateInput = {};

    if (parsed.employeeCode !== undefined)
      data.employeeCode = parsed.employeeCode;
    if (parsed.fullName !== undefined) data.fullName = parsed.fullName;
    if (parsed.email !== undefined) data.email = parsed.email;
    if (parsed.department !== undefined)
      data.department = parsed.department || null;
    if (parsed.jobTitle !== undefined) data.jobTitle = parsed.jobTitle || null;
    if (parsed.phone !== undefined) data.phone = parsed.phone || null;
    if (parsed.status !== undefined) data.status = parsed.status;
    if (parsed.baseSalary !== undefined) {
      data.baseSalary = new Prisma.Decimal(parsed.baseSalary);
    }
    if (parsed.hireDate) {
      data.hireDate = new Date(parsed.hireDate);
    }

    const employee = await prisma.employee.update({
      where: { id: employeeId },
      data,
    });

    res.json(employee);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const employeeId = Number(req.params.id);
    await prisma.payrollRun.deleteMany({ where: { employeeId } });
    await prisma.attendanceLog.deleteMany({ where: { employeeId } });
    await prisma.employee.delete({ where: { id: employeeId } });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default router;
