import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event);
    const limit = query.limit ? parseInt(query.limit) : null;
    const excludeId = query.excludeId ? parseInt(query.excludeId) : null;

    if (limit === null) {
      const paintings = await prisma.painting.findMany({
        where: {
          state: "FOR_SALE",
          ...(excludeId && { NOT: { id: excludeId } }),
        },
        orderBy: {
          date: "desc",
        },
      });
      return paintings;
    }

    const paintings = await prisma.$queryRaw`
      SELECT * FROM "Painting" 
      WHERE state = 'FOR_SALE' 
      ${excludeId ? Prisma.sql`AND id <> ${excludeId}` : Prisma.sql``}
      ORDER BY RANDOM() 
      LIMIT ${limit}
    `;

    return paintings || [];
  } catch (error) {
    console.error("API Error:", error);
    throw createError({
      statusCode: 500,
      message: "Erreur lors de la récupération des peintures",
      stack: error.stack,
    });
  }
});