import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const paintings = await prisma.painting.findMany({
			where: { state: 'FOR_SALE' },
		});
		return paintings;
	} catch (error) {
		return createError({
			statusCode: 500,
			message: "Erreur lors de la récupération des peintures",
		});
	}
});
