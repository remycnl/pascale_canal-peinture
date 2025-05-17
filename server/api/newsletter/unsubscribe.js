import prisma from "@/lib/prisma";

export default defineEventHandler(async (event) => {
	try {
		const query = getQuery(event);
		const email = query.email;
		const token = query.token;

		if (!email || !token) {
			return {
				success: false,
				message: "Paramètres manquants pour le désabonnement",
			};
		}

		// Vérifier que l'email existe et que le token est valide
		// Dans un cas réel, vous utiliserez une méthode plus sécurisée pour vérifier l'identité
		// Par exemple, un token unique généré lors de l'envoi de l'email de désabonnement
		const subscriber = await prisma.newsletterSubscriber.findUnique({
			where: {
				email,
			},
		});

		if (!subscriber) {
			return {
				success: false,
				message: "Adresse email non trouvée dans notre base de données",
			};
		}

		// Simple vérification: utiliser le token comme vérification
		// Dans un cas réel, utilisez un token cryptographiquement sécurisé
		const validToken =
			token === process.env.UNSUBSCRIBE_SECRET_TOKEN ||
			token === subscriber.verificationToken;

		if (!validToken) {
			return {
				success: false,
				message: "Token de désabonnement invalide",
			};
		}

		// Désactiver l'abonnement plutôt que le supprimer
		await prisma.newsletterSubscriber.update({
			where: {
				id: subscriber.id,
			},
			data: {
				isActive: false,
				updatedAt: new Date(),
			},
		});

		return {
			success: true,
			message: "Vous avez été désabonné avec succès de notre newsletter",
		};
	} catch (error) {
		console.error("Erreur lors du désabonnement:", error);

		return {
			success: false,
			message:
				"Une erreur est survenue lors du désabonnement. Veuillez réessayer plus tard.",
		};
	}
});
