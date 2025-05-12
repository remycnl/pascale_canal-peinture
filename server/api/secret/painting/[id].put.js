import prisma from "@/lib/prisma";
import cloudinary from "@/server/utils/cloudinary";

export default defineEventHandler(async (event) => {
	try {
		const id = event.context.params.id;
		const formData = await readMultipartFormData(event);
		if (!formData) throw new Error("No form data");

		// Extraction des champs du formData
		const getFieldValue = (fieldName) => {
			const field = formData.find((field) => field.name === fieldName);
			return field ? field.data.toString() : null;
		};

		// Get existing painting
		const existingPainting = await prisma.painting.findUnique({
			where: { id: parseInt(id) },
			include: { tags: true },
		});

		if (!existingPainting) {
			throw createError({
				statusCode: 404,
				message: "Painting not found",
			});
		}

		// Handle image update if new image is provided
		let imagePath = existingPainting.image;
		const imageFile = formData.find((field) => field.name === "image");

		if (imageFile) {
			// Delete old image from Cloudinary if it exists
			if (
				existingPainting.image &&
				existingPainting.image.includes("cloudinary.com")
			) {
				try {
					const urlParts = existingPainting.image.split("/");
					const filenameWithExtension = urlParts[urlParts.length - 1];
					const filename = filenameWithExtension.split(".")[0];
					const folderName = urlParts[urlParts.length - 2];
					const publicId = `${folderName}/${filename}`;

					await cloudinary.uploader.destroy(publicId);
				} catch (error) {
					console.error(
						"Erreur lors de la suppression de l'ancienne image sur Cloudinary:",
						error
					);
				}
			}

				// Upload new image to Cloudinary
			try {
				const base64Image = `data:${imageFile.type};base64,${Buffer.from(imageFile.data).toString('base64')}`;

				const uploadResult = await cloudinary.uploader.upload(base64Image, {
					folder: "paintings",
				});

				imagePath = uploadResult.secure_url;
			} catch (uploadError) {
				console.error(
					"Erreur lors de l'upload de la nouvelle image:",
					uploadError
				);
				throw new Error(`Erreur d'upload: ${uploadError.message}`);
			}
		}

		// Update painting in database
		const updatedPainting = await prisma.painting.update({
			where: { id: parseInt(id) },
			data: {
				name: getFieldValue("name") || existingPainting.name,
				description:
					getFieldValue("description") || existingPainting.description,
				price: getFieldValue("price")
					? parseFloat(getFieldValue("price"))
					: existingPainting.price,
				image: imagePath,
				artist: getFieldValue("artist") || existingPainting.artist,
				width: getFieldValue("width")
					? parseFloat(getFieldValue("width"))
					: existingPainting.width,
				height: getFieldValue("height")
					? parseFloat(getFieldValue("height"))
					: existingPainting.height,
				paintingType:
					getFieldValue("paintingType") || existingPainting.paintingType,
				slug: getFieldValue("slug") || existingPainting.slug,
				state: getFieldValue("state") || existingPainting.state,
				date: getFieldValue("date")
					? new Date(getFieldValue("date"))
					: existingPainting.date,
			},
		});

		const tagsField = formData.find((field) => field.name === "tags");
		if (tagsField) {
			try {
				const tagsArray = JSON.parse(tagsField.data.toString());

				if (Array.isArray(tagsArray) && tagsArray.length > 0) {
					// Delete existing tags
					await prisma.paintingTag.deleteMany({
						where: { paintingId: updatedPainting.id },
					});

					// Create new tags
					for (const tag of tagsArray) {
						if (
							[
								"ANIMAL",
								"PERSONNAGE",
								"PAYSAGE",
								"COMMANDE_PERSONNALISEE",
							].includes(tag)
						) {
							await prisma.paintingTag.create({
								data: {
									paintingId: updatedPainting.id,
									tag: tag,
								},
							});
						}
					}
				}
			} catch (parseError) {
				console.error("Erreur lors du parsing des tags:", parseError);
			}
		}

		// Récupérer la peinture mise à jour avec ses tags
		const paintingWithTags = await prisma.painting.findUnique({
			where: { id: updatedPainting.id },
			include: { tags: true },
		});

		return { painting: paintingWithTags };
	} catch (error) {
		console.error(
			"Erreur détaillée lors de la modification de la peinture:",
			error
		);
		throw createError({
			statusCode: 500,
			message: `Erreur lors de la modification de la peinture: ${error.message}`,
		});
	}
});
