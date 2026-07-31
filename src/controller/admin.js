import prisma from "../lib/prisma.js";

export async function getAllNotesAdmin(req, res, next) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";
    const search = req.query.search;

    const skip = (page - 1) * limit;

    const [notes, total] = await Promise.all([
      prisma.note.findMany({
        include: {
          user: {
            select: { id: true, email: true },
          },
        },
        where: {
          ...(search && {
            OR: [
              { title: { contains: search, mode: "insensitive" } },
              { content: { contains: search, mode: "insensitive" } },
            ],
          }),
        },
        take: limit,
        skip,
        orderBy: {
          [sort]: order,
        },
      }),
      prisma.note.count({}),
    ]);

    return res.json({
      data: notes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
}
