import prisma from '@/server/utils/prisma'

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const page = parseInt(query.page) || 1
    const limit = parseInt(query.limit) || 9
    const skip = (page - 1) * limit

    const paintings = await prisma.painting.findMany({
      // where: { state: 'FOR_SALE' },
      skip,
      take: limit,
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