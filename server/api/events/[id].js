import prisma from "@/lib/prisma";
import cloudinary from "@/server/utils/cloudinary";

export default defineEventHandler(async (event) => {
	const method = event.method;
	const id = Number(getRouterParam(event, "id"));

	if (!id) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid Event ID",
		});
	}

	try {
		switch (method) {
			case "GET":
				const singleEvent = await prisma.event.findUnique({
					where: { id },
				});

				if (!singleEvent) {
					throw createError({
						statusCode: 404,
						statusMessage: "Event not found",
					});
				}

				return singleEvent;

			case "PUT":
				const contentType = event.headers.get("content-type") || "";
				let updateData = {};

				if (contentType.includes("multipart/form-data")) {
					const formData = await readMultipartFormData(event);

					if (!formData) {
						throw createError({
							statusCode: 400,
							statusMessage: "Invalid form data",
						});
					}

					for (const field of formData) {
						const fieldName = field.name;

						if (fieldName === "imageUrl" && field.filename) {
							const imageData = field.data;
							const base64Image = `data:${
								field.type
							};base64,${imageData.toString("base64")}`;
							updateData.image = base64Image;
						} else {
							let value = field.data.toString();

							if (fieldName === "price") {
								value = value ? parseFloat(value) : null;
							} else if (
								fieldName === "isActive" ||
								fieldName === "showStartTime" ||
								fieldName === "showEndTime"
							) {
								value = value === "true";
							} else if (fieldName === "startDate" || fieldName === "endDate") {
								value = value === "null" || value === "" ? null : value;
							}

							updateData[fieldName] = value;
						}
					}
				} else {
					const body = await readBody(event);
					updateData = typeof body === "string" ? JSON.parse(body) : body;
				}

				const prismaUpdateData = { ...updateData };

				if (
					updateData.image &&
					typeof updateData.image === "string" &&
					updateData.image.startsWith("data:")
				) {
					const currentEvent = await prisma.event.findUnique({
						where: { id },
						select: { imageUrl: true },
					});

					if (
						currentEvent?.imageUrl &&
						currentEvent.imageUrl.includes("cloudinary.com")
					) {
						try {
							const publicId = extractPublicIdFromUrl(currentEvent.imageUrl);

							if (publicId) {
								await cloudinary.uploader.destroy(publicId);
							}
						} catch (error) {
							console.error(
								"Erreur lors de la suppression de l'ancienne image:",
								error
							);
						}
					}

					try {
						const uploadResult = await cloudinary.uploader.upload(
							updateData.image,
							{
								folder: "events",
							}
						);

						prismaUpdateData.imageUrl = uploadResult.secure_url;
					} catch (error) {
						console.error("Erreur lors de l'upload de l'image:", error);
						throw createError({
							statusCode: 500,
							statusMessage: "Échec de l'upload d'image",
						});
					}
				} else if (updateData.image === null) {
					const currentEvent = await prisma.event.findUnique({
						where: { id },
						select: { imageUrl: true },
					});

					if (
						currentEvent?.imageUrl &&
						currentEvent.imageUrl.includes("cloudinary.com")
					) {
						try {
							const publicId = extractPublicIdFromUrl(currentEvent.imageUrl);

							if (publicId) {
								await cloudinary.uploader.destroy(publicId);
							}
						} catch (error) {
							console.error("Erreur lors de la suppression de l'image:", error);
						}
					}

					prismaUpdateData.imageUrl = null;
				}

				delete prismaUpdateData.image;
				delete prismaUpdateData.imageUrl_file;
				delete prismaUpdateData.id;
				delete prismaUpdateData.createdAt;
				delete prismaUpdateData.updatedAt;

				const updatedEvent = await prisma.event.update({
					where: { id },
					data: prismaUpdateData,
				});
				return updatedEvent;

			case "DELETE":
				const eventToDelete = await prisma.event.findUnique({
					where: { id },
				});

				if (
					eventToDelete?.imageUrl &&
					eventToDelete.imageUrl.includes("cloudinary.com")
				) {
					try {
						const publicId = extractPublicIdFromUrl(eventToDelete.imageUrl);

						if (publicId) {
							await cloudinary.uploader.destroy(publicId);
						}
					} catch (error) {
						console.error("Erreur lors de la suppression de l'image:", error);
					}
				}

				const deletedEvent = await prisma.event.delete({
					where: { id },
				});

				return deletedEvent;

			default:
				throw createError({
					statusCode: 405,
					statusMessage: "Method Not Allowed",
				});
		}
	} catch (error) {
		console.error("Erreur API Event:", error);

		if (error.code === "P2025") {
			throw createError({
				statusCode: 404,
				statusMessage: "Événement non trouvé",
			});
		}

		throw createError({
			statusCode: 500,
			statusMessage: `Erreur interne du serveur: ${error.message}`,
		});
	}
});

function extractPublicIdFromUrl(url) {
	if (!url || !url.includes("cloudinary.com")) return null;

	try {
		const regex = /\/v\d+\/([^/]+\/[^.]+)/;
		const match = url.match(regex);

		if (match && match[1]) {
			return match[1];
		}

		const urlParts = url.split("/");
		const filenameWithExtension = urlParts[urlParts.length - 1];
		const filename = filenameWithExtension.split(".")[0];
		const folderName = urlParts[urlParts.length - 2];

		return `${folderName}/${filename}`;
	} catch (error) {
		console.error("Erreur lors de l'extraction du public_id:", error);
		return null;
	}
}
