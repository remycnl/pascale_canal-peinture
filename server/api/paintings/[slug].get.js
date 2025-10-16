import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const { slug } = event.context.params;

		const painting = await prisma.painting.findUnique({
			where: { slug }
		});

		if (!painting) {
			return createError({
				statusCode: 404,
				message: `Aucune peinture trouvée avec le slug : ${slug}`,
			});
		}

		// Récupérer les tailles de posters globales disponibles seulement si posterAvailable est true
		let posterSizes = [];
		if (painting.posterAvailable) {
			posterSizes = await prisma.globalPosterSize.findMany({
				where: { isActive: true },
				orderBy: { order: 'asc' }
			});
		}

		// Ajouter les tailles de posters à la peinture
		const paintingWithPosters = {
			...painting,
			posterSizes
		};

		return paintingWithPosters;
	} catch (error) {
		return createError({
			statusCode: 500,
			message: "Erreur lors de la récupération de la peinture",
		});
	}
});
