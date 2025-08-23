import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const { id } = event.context.params;

		await prisma.globalPosterSize.delete({
			where: { id: parseInt(id) }
		});

		return { success: true, message: "Taille de poster supprimée avec succès" };
	} catch (error) {
		console.error("Erreur lors de la suppression de la taille de poster :", error);
		return createError({
			statusCode: 500,
			message: "Erreur lors de la suppression de la taille de poster",
		});
	}
});
