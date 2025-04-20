import { prisma } from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const { slug } = event.context.params;

		const painting = await prisma.painting.findUnique({
			where: { slug },
		});

		if (!painting) {
			return createError({
				statusCode: 404,
				message: `Aucune peinture trouvée avec le slug : ${slug}`,
			});
		}

		return painting;
	} catch (error) {
		return createError({
			statusCode: 500,
			message: "Erreur lors de la récupération de la peinture",
		});
	}
});
