import { writeFile, unlink } from "fs/promises";
import { join } from "path";
import prisma from "@/lib/prisma";

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
			// Delete old image
			const oldImagePath = join(
				process.cwd(),
				"public",
				existingPainting.image
			);
			try {
				await unlink(oldImagePath);
			} catch (error) {
				console.error("Error deleting old image:", error);
			}

			// Save new image
			const fileExtension = imageFile.filename.split(".").pop();
			const uniqueFileName = `${Date.now()}-${Math.random()
				.toString(36)
				.substring(7)}.${fileExtension}`;
			imagePath = `/paintings/${uniqueFileName}`;
			const absolutePath = join(
				process.cwd(),
				"public",
				"paintings",
				uniqueFileName
			);
			await writeFile(absolutePath, imageFile.data);
		}

		// Update painting in database
		const painting = await prisma.painting.update({
			where: { id: parseInt(id) },
			data: {
				name: getFieldValue("name") || existingPainting.name,
				description: getFieldValue("description") || existingPainting.description,
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
				paintingType: getFieldValue("paintingType") || existingPainting.paintingType,
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
		console.error("Erreur lors de la modification de la peinture:", error);
		throw createError({
			statusCode: 500,
			message: "Erreur lors de la modification de la peinture",
		});
	}
});
