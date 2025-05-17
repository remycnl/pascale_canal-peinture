// /server/api/contact.js
import { sendContactEmail } from "../utils/email";

export default defineEventHandler(async (event) => {
	try {
		// Récupération des données du formulaire
		const formData = await readBody(event);

		// Validation des données essentielles
		if (!formData.email || !formData.firstName || !formData.message) {
			return {
				success: false,
				error:
					"Informations incomplètes. Veuillez remplir tous les champs obligatoires.",
			};
		}

		// Validation du consentement RGPD
		if (!formData.rgpdConsent) {
			return {
				success: false,
				error:
					"Vous devez accepter la politique de confidentialité pour envoyer un message.",
			};
		}

		// Envoi de l'email
		const result = await sendContactEmail(formData);

		if (!result.success) {
			console.error("Erreur lors de l'envoi de l'email:", result.error);
			return {
				success: false,
				error:
					"Une erreur est survenue lors de l'envoi de votre message. Veuillez réessayer plus tard.",
			};
		}

		// En cas de succès, renvoyer une réponse positive
		return {
			success: true,
			message:
				"Votre message a été envoyé avec succès. Nous vous répondrons dans les plus brefs délais.",
		};
	} catch (error) {
		console.error(
			"Erreur serveur lors du traitement du formulaire de contact:",
			error
		);

		return {
			success: false,
			error: "Une erreur serveur est survenue. Veuillez réessayer plus tard.",
		};
	}
});
