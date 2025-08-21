import { sendContactEmail } from "@/server/utils/mail";
import prisma from "@/lib/prisma";

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

		// Si c'est un achat d'œuvre, générer le contenu HTML du ticket
		if (formData.reason === "artwork" && formData.selectedArtworks) {
			formData.fullTicketHtml = await generateTicketHtml(formData);
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

// Fonction pour générer le ticket HTML côté serveur
async function generateTicketHtml(formData) {
	// Récupérer les tailles d'affiches depuis la base de données
	let posterSizes = [];

	try {
		// Récupération directe depuis Prisma
		posterSizes = await prisma.globalPosterSize.findMany({
			orderBy: { price: "asc" },
		});

		await prisma.$disconnect();
	} catch (error) {
		console.error(
			"Erreur lors de la récupération des tailles d'affiches:",
			error
		);
		posterSizes = [];
	}

	let totalPrice = 0;
	let ticketItems = [];

	// Traiter chaque œuvre sélectionnée
	if (formData.selectedArtworks && formData.selectedArtworks.length > 0) {
		formData.selectedArtworks.forEach((artwork) => {
			const format = formData.selectedFormats?.[artwork.id];
			let itemPrice = 0;
			let formatType = "";
			let dimensions = "";

			if (format) {
				if (format.type === "original" && artwork.state !== "OFF_SALE") {
					formatType = "Œuvre originale";
					itemPrice = parseFloat(artwork.price) || 0;
				} else if (format.type === "poster" && format.posterSizeId) {
					const posterSize = posterSizes.find(
						(size) => size.id === parseInt(format.posterSizeId)
					);

					if (posterSize) {
						formatType = `Affiche ${posterSize.name}`;
						dimensions = `${posterSize.width}×${posterSize.height}cm`;
						itemPrice = parseFloat(posterSize.price) || 0;
					} else {
						console.error(
							`Taille d'affiche non trouvée pour l'ID: ${format.posterSizeId}`
						);
						formatType = "Affiche (taille non trouvée)";
						itemPrice = 0;
					}
				} else if (format.type === "poster" && !format.posterSizeId) {
					console.error("Format poster sélectionné mais pas de posterSizeId");
					formatType = "Affiche (taille non spécifiée)";
					itemPrice = 0;
				}
			} else {
				console.error(`Pas de format sélectionné pour l'œuvre ${artwork.name}`);
			}

			ticketItems.push({
				name: artwork.name || "Sans titre",
				formatType,
				dimensions,
				price: itemPrice,
			});

			totalPrice += itemPrice;
		});
	}

	const currentDate = new Date().toLocaleDateString("fr-FR", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});

	const currentTime = new Date().toLocaleTimeString("fr-FR", {
		hour: "2-digit",
		minute: "2-digit",
	});

	// Formater le message avec les tirets
	const formattedMessage = formData.message
		.split("\n")
		.map((line) => {
			line = line.trim();
			if (line.startsWith("-")) {
				return `<div style="margin-left: 10px; margin-top: 2px;">• ${line
					.substring(1)
					.trim()}</div>`;
			}
			return line ? `<div>${line}</div>` : "<br>";
		})
		.join("");

	// Générer le HTML du ticket
	const ticketHtml = `
    <div style="font-family: 'Courier New', monospace; background: #f8f8f8; padding: 16px; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); max-width: 500px; margin: 20px auto; border: 2px solid #333;">
      <div style="text-align: center; border-bottom: 2px dashed #333; padding-bottom: 12px; margin-bottom: 16px;">
        <div style="font-size: 18px; font-weight: bold; margin-bottom: 6px;">🎨 GALERIE PASCALE CANAL</div>
        <div style="font-size: 12px; color: #666; font-weight: bold;">DEMANDE D'ACQUISITION</div>
        <div style="font-size: 10px; margin-top: 8px; color: #888;">
          <div>${currentDate}</div>
          <div>${currentTime}</div>
        </div>
      </div>

      <div style="margin-bottom: 16px;">
        ${ticketItems
					.map(
						(item, index) => `
          <div style="margin-bottom: 12px; padding-bottom: 8px; ${
						index < ticketItems.length - 1
							? "border-bottom: 1px dotted #ccc;"
							: ""
					}">
            <div style="font-weight: bold; font-size: 12px; margin-bottom: 3px; color: #333;">${
							item.name
						}</div>
            <div style="font-size: 10px; color: #666; margin-bottom: 2px;">${
							item.formatType
						}</div>
            ${
							item.dimensions
								? `<div style="font-size: 9px; color: #888; font-style: italic;">${item.dimensions}</div>`
								: ""
						}
            <div style="text-align: right; font-weight: bold; margin-top: 6px;">
              <span style="font-size: 13px; color: #2c5530;">${item.price.toFixed(
								2
							)} €</span>
            </div>
          </div>
        `
					)
					.join("")}
      </div>

      <div style="border-top: 2px solid #333; padding-top: 12px; margin-top: 16px; background-color: #f0f0f0; margin-left: -16px; margin-right: -16px; padding-left: 16px; padding-right: 16px;">
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="font-size: 13px; font-weight: bold; color: #333; text-align: left;">
              TOTAL (${formData.selectedArtworks.length} article${formData.selectedArtworks.length > 1 ? 's' : ''})
            </td>
            <td style="font-size: 18px; font-weight: bold; color: #2c5530; text-align: right;">
              ${totalPrice.toFixed(2)} €
            </td>
          </tr>
        </table>
      </div>

      <div style="margin-top: 20px; padding-top: 16px; border-top: 1px dashed #333; font-size: 11px; line-height: 1.6;">
        <div style="margin-bottom: 10px; font-weight: bold; color: #333;">MESSAGE DU CLIENT:</div>
        <div style="background-color: #fff; padding: 12px; border-radius: 4px; border-left: 3px solid #007cba;">
          ${formattedMessage}
        </div>
      </div>

      <div style="text-align: center; margin-top: 20px; padding-top: 12px; border-top: 1px dashed #333; font-size: 9px; color: #888;">
        <div style="margin-bottom: 4px;">Client: ${formData.firstName} ${
		formData.lastName || ""
	}</div>
        <div style="margin-bottom: 4px;">Email: ${formData.email}</div>
        ${
					formData.phone
						? `<div style="margin-bottom: 4px;">Tél: ${formData.phone}</div>`
						: ""
				}
        <div style="margin-top: 8px;">Ticket généré automatiquement le ${currentDate} à ${currentTime}</div>
        <div style="margin-top: 6px;">━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</div>
      </div>
    </div>
  `;

	return ticketHtml;
}
