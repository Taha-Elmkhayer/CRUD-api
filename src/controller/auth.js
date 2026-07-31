import { registerSchema, loginSchema } from "../validators/auth.js";
import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { sendVerificationEmail } from "../lib/email.js";

export async function registerUser(req, res, next) {
  const validation = registerSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: "Invalide Email or Password" });
  }

  const { email, password } = validation.data;

  try {
    const dup_email = await prisma.user.findUnique({
      where: { email },
    });

    if (dup_email) {
      // dublicate email exits
      return res.status(409).json({ error: "Email Already exists" });
    }

    const verificationToken = crypto.randomBytes(32).toString("hex");

    const hashedPassword = await bcrypt.hash(password, 10);
    const new_user = await prisma.user.create({
      data: { email, password: hashedPassword, verificationToken },
    });

    await sendVerificationEmail(email, verificationToken);

    return res.status(201).json({
      id: new_user.id,
      email: new_user.email,
      createdAt: new_user.createdAt,
    });
  } catch (error) {
    next(error);
  }
}

export async function loginUser(req, res, next) {
  const validation = loginSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ error: "Invalid Email or Password" });
  }

  const { email, password } = validation.data;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User Not Found" });
    }

    if (!user.isVerified) {
      return res.status(403).json({ error: "Please Verify Your Email First" });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid Password" });
    }

    const token = jwt.sign(
      { userId: user.id }, // payload
      process.env.JWT_SECRET, // secret key
      { expiresIn: "7d" },
    );
    return res.status(200).json({ token });
  } catch (error) {
    next(error);
  }
}

export async function verifyEmail(req, res, next) {
  const token = req.params.token;

  try {
    const user = await prisma.user.findUnique({
      where: { verificationToken: token },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid Token" });
    }

    await prisma.user.update({
      where: { verificationToken: token },
      data: { isVerified: true, verificationToken: null },
    });

    return res.status(200).json({ note: "Email Verified Successfully" });
  } catch (err) {
    next(err);
  }
}
