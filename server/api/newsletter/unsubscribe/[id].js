// /server/api/newsletter/admin/unsubscribe/[id].js
import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const id = parseInt(event.context.params.id);

		if (isNaN(id)) {
			return {
				success: false,
				message: "ID invalide",
			};
		}

		// Vérifier si l'abonnement existe
		const subscriber = await prisma.newsletterSubscriber.findUnique({
			where: { id },
		});

		if (!subscriber) {
			return {
				success: false,
				message: "Abonnement non trouvé",
			};
		}

		// Mettre à jour l'abonnement pour le désactiver
		await prisma.newsletterSubscriber.update({
			where: { id },
			data: {
				isActive: false,
				unsubscribedAt: new Date(),
			},
		});

		return {
			success: true,
			message: "Abonnement désactivé avec succès",
		};
	} catch (error) {
		console.error("Erreur lors de la désactivation de l'abonnement:", error);

		return {
			success: false,
			message:
				"Une erreur est survenue lors de la désactivation de l'abonnement",
		};
	}
});
