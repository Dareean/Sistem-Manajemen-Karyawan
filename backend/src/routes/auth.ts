import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../lib/prisma";
import { loginSchema, registerSchema } from "../schemas/authSchema";
import { createToken, requireAuth } from "../middleware/auth";
import { mapUserResponse } from "../utils/userMapper";

const router = Router();

const generateEmployeeCode = async () => {
  const attempt = () =>
    `KRY-${Math.floor(Date.now() / 1000)}-${Math.floor(Math.random() * 999)}`;
  let code = attempt();
  let exists = await prisma.employee.findUnique({
    where: { employeeCode: code },
  });
  while (exists) {
    code = attempt();
    exists = await prisma.employee.findUnique({
      where: { employeeCode: code },
    });
  }
  return code;
};

router.post("/register", async (req, res, next) => {
  try {
    const payload = registerSchema.parse(req.body);
    const existing = await prisma.user.findUnique({
      where: { email: payload.email },
    });
    if (existing) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    const passwordHash = await bcrypt.hash(payload.password, 10);
    const employeeCode = await generateEmployeeCode();

    const user = await prisma.user.create({
      data: {
        email: payload.email,
        passwordHash,
        role: "EMPLOYEE",
        employee: {
          create: {
            employeeCode,
            fullName: payload.fullName,
            email: payload.email,
            phone: payload.phone || null,
            department: payload.department || null,
            jobTitle: payload.jobTitle || null,
            baseSalary: 0,
            status: "ACTIVE",
          },
        },
      },
      include: { employee: true },
    });

    const token = createToken({
      userId: user.id,
      role: user.role,
      employeeId: user.employee?.id ?? null,
    });

    return res.status(201).json({ token, user: mapUserResponse(user) });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const payload = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: payload.email },
      include: { employee: true },
    });

    if (!user) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const valid = await bcrypt.compare(payload.password, user.passwordHash);
    if (!valid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = createToken({
      userId: user.id,
      role: user.role,
      employeeId: user.employee?.id ?? null,
    });

    return res.json({ token, user: mapUserResponse(user) });
  } catch (error) {
    return next(error);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.userId },
      include: { employee: true },
    });

    if (!user) {
      return res.status(404).json({ message: "Pengguna tidak ditemukan" });
    }

    return res.json({ user: mapUserResponse(user) });
  } catch (error) {
    return next(error);
  }
});

export default router;
