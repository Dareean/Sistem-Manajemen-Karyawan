import { Router } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { profileUpdateSchema } from "../schemas/profileSchema";
import { ensureEmployeeContext, requireAuth } from "../middleware/auth";

const router = Router();

router.use(requireAuth, ensureEmployeeContext);

router.get("/me", async (req, res, next) => {
  try {
    const employee = await prisma.employee.findUnique({
      where: { id: req.user!.employeeId! },
    });
    if (!employee) {
      return res
        .status(404)
        .json({ message: "Profil karyawan tidak ditemukan" });
    }
    return res.json(employee);
  } catch (error) {
    return next(error);
  }
});

router.put("/me", async (req, res, next) => {
  try {
    const payload = profileUpdateSchema.parse(req.body);
    const data: Prisma.EmployeeUpdateInput = {};

    if (payload.fullName !== undefined) {
      data.fullName = payload.fullName;
    }
    if (payload.phone !== undefined) {
      data.phone = payload.phone || null;
    }
    if (payload.department !== undefined) {
      data.department = payload.department || null;
    }
    if (payload.jobTitle !== undefined) {
      data.jobTitle = payload.jobTitle || null;
    }

    const employee = await prisma.employee.update({
      where: { id: req.user!.employeeId! },
      data,
    });
    return res.json(employee);
  } catch (error) {
    return next(error);
  }
});

export default router;
