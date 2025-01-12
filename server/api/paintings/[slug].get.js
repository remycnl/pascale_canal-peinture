import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		// Récupère le paramètre slug depuis l'URL
		const { slug } = event.context.params;

		// Cherche une peinture qui correspond au slug
		const painting = await prisma.painting.findUnique({
			where: { slug },
		});

		// Si aucune peinture n'est trouvée, renvoie une erreur 404
		if (!painting) {
			return createError({
				statusCode: 404,
				message: `Aucune peinture trouvée avec le slug : ${slug}`,
			});
		}

		return painting;
	} catch (error) {
		// Gère les erreurs inattendues
		return createError({
			statusCode: 500,
			message: "Erreur lors de la récupération de la peinture",
		});
	}
});
