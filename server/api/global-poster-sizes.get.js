import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const posterSizes = await prisma.globalPosterSize.findMany({
			where: { isActive: true },
			orderBy: { order: 'asc' }
		});

		return posterSizes;
	} catch (error) {
		console.error("Erreur lors de la récupération des tailles de posters :", error);
		return createError({
			statusCode: 500,
			message: "Erreur lors de la récupération des tailles de posters.",
		});
	}
});
