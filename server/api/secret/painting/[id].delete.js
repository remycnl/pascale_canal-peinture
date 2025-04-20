import { prisma } from "@/lib/prisma";
import cloudinary from "@/server/utils/cloudinary";

export default defineEventHandler(async (event) => {
	try {
		const id = event.context.params.id;

		// Get painting to delete
		const painting = await prisma.painting.findUnique({
			where: { id: parseInt(id) },
		});

		if (!painting) {
			throw createError({
				statusCode: 404,
				message: "Painting not found",
			});
		}

		// Extract public_id from Cloudinary URL
		if (painting.image && painting.image.includes("cloudinary.com")) {
			try {
				const urlParts = painting.image.split("/");
				const filenameWithExtension = urlParts[urlParts.length - 1];
				const filename = filenameWithExtension.split(".")[0];
				const folderName = urlParts[urlParts.length - 2];
				const publicId = `${folderName}/${filename}`;

				// Suppression de l'image sur Cloudinary
				await cloudinary.uploader.destroy(publicId);
			} catch (error) {
				console.error(
					"Erreur lors de la suppression de l'image sur Cloudinary:",
					error
				);
			}
		}

		// Delete painting from database
		await prisma.painting.delete({
			where: { id: parseInt(id) },
		});

		return { message: "Painting deleted successfully" };
	} catch (error) {
		console.error("Erreur lors de la suppression de la peinture:", error);
		throw createError({
			statusCode: 500,
			message: "Erreur lors de la suppression de la peinture",
		});
	}
});
