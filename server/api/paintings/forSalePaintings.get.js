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

    // Récupérer tous les IDs des peintures FOR_SALE (en excluant excludeId si fourni)
    const paintingIds = await prisma.painting.findMany({
      where: {
        state: "FOR_SALE",
        ...(excludeId && { NOT: { id: excludeId } }),
      },
      select: {
        id: true,
      },
    });

    // Mélanger les IDs et prendre les premiers 'limit' éléments
    const shuffledIds = paintingIds.sort(() => Math.random() - 0.5).slice(0, limit);
    
    // Récupérer les peintures complètes dans l'ordre original (par date)
    const paintings = await prisma.painting.findMany({
      where: {
        id: {
          in: shuffledIds.map(p => p.id),
        },
      },
      orderBy: {
        date: "desc",
      },
    });

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