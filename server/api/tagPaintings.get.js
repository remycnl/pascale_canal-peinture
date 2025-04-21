import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const tag = query.tag;

		if (!tag) {
			throw createError({
				statusCode: 400,
				message: "Le paramètre tag est requis",
			});
		}

		const paintings = await prisma.painting.findMany({
			where: {
				tags: {
					some: {
						tag: tag,
					},
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
