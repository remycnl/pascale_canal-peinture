// /server/api/newsletter/admin/reactivate/[id].js
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

		// Mettre à jour l'abonnement pour le réactiver
		await prisma.newsletterSubscriber.update({
			where: { id },
			data: {
				isActive: true,
				unsubscribedAt: null,
			},
		});

		return {
			success: true,
			message: "Abonnement réactivé avec succès",
		};
	} catch (error) {
		console.error("Erreur lors de la réactivation de l'abonnement:", error);

		return {
			success: false,
			message:
				"Une erreur est survenue lors de la réactivation de l'abonnement",
		};
	}
});
