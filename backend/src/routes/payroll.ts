import { Router } from "express";
import type { Prisma } from "@prisma/client";
import prisma from "../lib/prisma";
import { payrollRunSchema } from "../schemas/payrollSchema";
import { runPayroll } from "../services/payrollService";
import { requireAuth, requireRole } from "../middleware/auth";

const router = Router();

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { employeeId, status } = req.query;
    const where: Prisma.PayrollRunWhereInput = {};
    const isAdmin = req.user?.role === "ADMIN";

    if (employeeId) {
      if (!isAdmin) {
        return res.status(403).json({ message: "Anda tidak memiliki akses" });
      }
      where.employeeId = Number(employeeId);
    } else if (!isAdmin) {
      if (!req.user?.employeeId) {
        return res
          .status(403)
          .json({ message: "Profil karyawan tidak ditemukan" });
      }
      where.employeeId = req.user.employeeId;
    }

    if (status) {
      where.status = (status as string).toUpperCase();
    }

    const payrolls = await prisma.payrollRun.findMany({
      where,
      include: { employee: true },
      orderBy: { generatedAt: "desc" },
    });

    res.json(payrolls);
  } catch (error) {
    next(error);
  }
});

router.post("/run", requireRole(["ADMIN"]), async (req, res, next) => {
  try {
    const payload = payrollRunSchema.parse(req.body);
    const result = await runPayroll(payload);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

router.patch("/:id/status", requireRole(["ADMIN"]), async (req, res, next) => {
  try {
    const payrollId = Number(req.params.id);
    const { status } = req.body as { status: string };
    const allowed = ["PENDING", "APPROVED", "PAID"];

    if (!allowed.includes(status?.toUpperCase())) {
      return res.status(400).json({ message: "Status tidak valid" });
    }

    const payroll = await prisma.payrollRun.update({
      where: { id: payrollId },
      data: { status: status.toUpperCase() as (typeof allowed)[number] },
    });

    res.json(payroll);
  } catch (error) {
    next(error);
  }
});

export default router;
