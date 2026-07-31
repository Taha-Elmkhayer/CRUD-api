import prisma from "../lib/prisma.js";

export default function requireRole(role) {
  return async function (req, res, next) {
    const userId = req.userId;

    try {
      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (user.role !== role || !user) {
        return res.status(403).json({ error: "Forbidden action" });
      }
      next();
    } catch (err) {
      next(err);
    }
  };
}
