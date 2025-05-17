import { sendPersonalizedCommandEmail } from "@/server/utils/mail";

export default defineEventHandler(async (event) => {
	try {
		// Utilisation de setResponseStatus pour s'assurer que les erreurs sont correctement traitées
		const body = await readBody(event);

		// Validation des données
		if (!body.name || !body.email || !body.description) {
			setResponseStatus(event, 400);
			return {
				success: false,
				error:
					"Informations manquantes. Veuillez remplir tous les champs obligatoires.",
			};
		}

		if (!body.photos || body.photos.length === 0) {
			setResponseStatus(event, 400);
			return {
				success: false,
				error: "Veuillez ajouter au moins une photo de référence.",
			};
		}

		// Vérification des tailles des photos
		let totalSize = 0;
		for (const photo of body.photos) {
			// Estimer la taille de l'image base64
			if (photo.preview) {
				const base64Length = photo.preview.length;
				// Conversion approximative en octets
				const sizeInBytes = Math.round((base64Length * 3) / 4);
				totalSize += sizeInBytes;

				// Si une seule image dépasse 10MB
				if (sizeInBytes > 10 * 1024 * 1024) {
					setResponseStatus(event, 400);
					return {
						success: false,
						error:
							"Une des images dépasse la taille maximale autorisée (10MB).",
					};
				}
			}
		}

		// Si le total dépasse 25MB, c'est probablement trop pour un email
		if (totalSize > 25 * 1024 * 1024) {
			setResponseStatus(event, 400);
			return {
				success: false,
				error:
					"La taille totale des images dépasse la limite. Veuillez réduire la taille ou le nombre d'images.",
			};
		}

		// Préparation des données pour l'envoi d'email
		const formData = {
			name: body.name,
			email: body.email,
			phone: body.phone || "",
			description: body.description,
			photos: body.photos
				.filter((photo) => photo.preview)
				.map((photo) => ({
					base64Data: photo.preview,
				})),
		};

		// Envoi de l'email
		const result = await sendPersonalizedCommandEmail(formData);

		if (!result.success) {
			console.error("Erreur lors de l'envoi de l'email:", result.error);
			setResponseStatus(event, 500);
			return {
				success: false,
				error: "Une erreur s'est produite lors de l'envoi de votre demande.",
			};
		}

		setResponseStatus(event, 200);
		return {
			success: true,
			message:
				"Votre demande a bien été envoyée. Nous vous contacterons prochainement.",
		};
	} catch (error) {
		console.error("Erreur lors du traitement de la demande:", error);
		setResponseStatus(event, 500);
		return {
			success: false,
			error:
				"Une erreur inattendue s'est produite. Veuillez réessayer ultérieurement.",
		};
	}
});
