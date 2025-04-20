import { prisma } from "@/lib/prisma";
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
				const base64Image = `data:${imageFile.type};base64,${Buffer.from(
					imageFile.data
				).toString("base64")}`;

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
		const painting = await prisma.painting.update({
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
				tag: getFieldValue("tag") || existingPainting.tag,
				slug: getFieldValue("slug") || existingPainting.slug,
				state: getFieldValue("state") || existingPainting.state,
				date: getFieldValue("date")
					? new Date(getFieldValue("date"))
					: existingPainting.date,
			},
		});

		return { painting };
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
