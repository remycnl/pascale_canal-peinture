import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const token = query.token;

		if (!token) {
			return {
				success: false,
				message: "Token de désinscription manquant",
			};
		}

		// Rechercher l'abonnement correspondant au token
		const subscriber = await prisma.newsletterSubscriber.findUnique({
			where: {
				unsubscribeToken: token,
			},
		});

		if (!subscriber) {
			return {
				success: false,
				message: "Token de désinscription invalide",
			};
		}

		// Si l'abonné est déjà actif
		if (subscriber.isActive) {
			return {
				success: true,
				message: "Votre abonnement est déjà actif",
			};
		}

		// Mettre à jour l'abonnement pour le réactiver
		await prisma.newsletterSubscriber.update({
			where: {
				id: subscriber.id,
			},
			data: {
				isActive: true,
				unsubscribedAt: null,
			},
		});

		return {
			success: true,
			message: "Votre abonnement a été réactivé avec succès",
		};
	} catch (error) {
		console.error("Erreur lors de la réactivation:", error);

		return {
			success: false,
			message:
				"Une erreur est survenue lors de la réactivation de votre abonnement",
		};
	}
});
