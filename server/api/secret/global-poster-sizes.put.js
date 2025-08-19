import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);
		const { posterSizes } = body;

		// Mettre à jour chaque taille
		const updatePromises = posterSizes.map(size => 
			prisma.globalPosterSize.update({
				where: { id: size.id },
				data: {
					name: size.name,
					width: parseFloat(size.width),
					height: parseFloat(size.height),
					price: parseFloat(size.price),
					order: parseInt(size.order),
					isActive: size.isActive
				}
			})
		);

		await Promise.all(updatePromises);

		return { success: true, message: "Tailles d'affiches mises à jour avec succès" };
	} catch (error) {
		console.error("Erreur lors de la sauvegarde des tailles d'affiches:", error);
		return createError({
			statusCode: 500,
			message: "Erreur lors de la sauvegarde des tailles d'affiches",
		});
	}
});
