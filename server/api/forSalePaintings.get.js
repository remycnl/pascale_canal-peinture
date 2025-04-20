import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
  try {
    const paintings = await prisma.painting.findMany({
      where: {
        state: "FOR_SALE"
      },
      orderBy: {
        date: "desc",
      }
    })

    return paintings || []

  } catch (error) {
    console.error('API Error:', error)
    throw createError({
      statusCode: 500,
      message: 'Erreur lors de la récupération des peintures',
      stack: error.stack
    })
  }
})
