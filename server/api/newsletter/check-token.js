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
			select: {
				id: true,
				email: true,
				subscriptionType: true,
				isActive: true,
			},
		});

		if (!subscriber) {
			return {
				success: false,
				message: "Token de désinscription invalide",
			};
		}

		return {
			success: true,
			subscriber,
		};
	} catch (error) {
		console.error("Erreur lors de la vérification du token:", error);

		return {
			success: false,
			message: "Une erreur est survenue lors de la vérification du token",
		};
	}
});
