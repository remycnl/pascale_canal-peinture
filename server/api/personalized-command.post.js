import { sendPersonalizedCommandEmail } from "@/server/utils/mail";

export default defineEventHandler(async (event) => {
	try {
		const body = await readBody(event);

		// Validation des données
		if (!body.name || !body.email || !body.description) {
			return {
				success: false,
				error:
					"Informations manquantes. Veuillez remplir tous les champs obligatoires.",
			};
		}

		if (!body.photos || body.photos.length === 0) {
			return {
				success: false,
				error: "Veuillez ajouter au moins une photo de référence.",
			};
		}

		// Préparation des données pour l'envoi d'email
		const formData = {
			name: body.name,
			email: body.email,
			phone: body.phone || "",
			description: body.description,
			photos: body.photos.map((photo) => ({
				base64Data: photo.preview,
			})),
		};

		// Envoi de l'email
		const result = await sendPersonalizedCommandEmail(formData);

		if (!result.success) {
			console.error("Erreur lors de l'envoi de l'email:", result.error);
			return {
				success: false,
				error: "Une erreur s'est produite lors de l'envoi de votre demande.",
			};
		}

		return {
			success: true,
			message:
				"Votre demande a bien été envoyée. Nous vous contacterons prochainement.",
		};
	} catch (error) {
		console.error("Erreur lors du traitement de la demande:", error);
		return {
			success: false,
			error:
				"Une erreur inattendue s'est produite. Veuillez réessayer ultérieurement.",
		};
	}
});
