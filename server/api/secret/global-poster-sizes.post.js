import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const method = event.method;
		
		if (method === 'POST') {
			// Créer une nouvelle taille
			const body = await readBody(event);
			const { name, width, height, price, order = 0 } = body;

			const posterSize = await prisma.globalPosterSize.create({
				data: {
					name,
					width: parseFloat(width),
					height: parseFloat(height),
					price: parseFloat(price),
					order: parseInt(order)
				}
			});

			return posterSize;
		}

		if (method === 'PUT') {
			// Mettre à jour les tailles existantes (bulk update)
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
		}

		return createError({
			statusCode: 405,
			message: "Méthode non autorisée",
		});

	} catch (error) {
		console.error("Erreur lors de la gestion des tailles d'affiches :", error);
		return createError({
			statusCode: 500,
			message: "Erreur lors de la gestion des tailles d'affiches",
		});
	}
});
