<script setup>
import { ref, nextTick, computed, watch } from "vue";

const emit = defineEmits(["form-submitted"]);

const descriptionTextarea = ref(null);

const formErrors = ref({
	name: "",
	email: "",
	phone: "",
	description: "",
	rgpdConsent: "",
	photos: "",
});

const formData = ref({
	name: "",
	email: "",
	phone: "",
	description: "",
	rgpdConsent: false,
});

const uploadedPhotos = ref([]);
const isSubmitting = ref(false);
const formSubmitted = ref(false);
const formError = ref(null);
const formTouched = ref(false);
const showErrors = ref(false);

const resizeTextarea = () => {
	if (!descriptionTextarea.value) return;

	descriptionTextarea.value.style.height = "auto";
	descriptionTextarea.value.style.height =
		descriptionTextarea.value.scrollHeight + "px";
};

const validateForm = () => {
	let isValid = true;
	formErrors.value.name = formData.value.name
		? ""
		: "Veuillez indiquer votre nom";
	formErrors.value.email = formData.value.email
		? isValidEmail(formData.value.email)
			? ""
			: "Veuillez indiquer une adresse email valide"
		: "Veuillez indiquer votre email";
	formErrors.value.description = formData.value.description
		? ""
		: "Veuillez décrire votre projet";
	formErrors.value.rgpdConsent = formData.value.rgpdConsent
		? ""
		: "Vous devez accepter les conditions d'utilisation des données";
	formErrors.value.photos =
		uploadedPhotos.value.length > 0
			? ""
			: "Veuillez ajouter au moins une photo de référence";

	for (const key in formErrors.value) {
		if (formErrors.value[key]) {
			isValid = false;
		}
	}

	return isValid;
};

const isValidEmail = (email) => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

watch(
	() => formData.value.description,
	() => {
		nextTick(resizeTextarea);
	}
);

const buttonState = computed(() => {
	if (isSubmitting.value) return "submitting";
	if (formTouched.value && validateForm()) return "ready";
	return "default";
});

watch(
	formData,
	() => {
		formTouched.value = true;
	},
	{ deep: true }
);

watch(
	uploadedPhotos,
	() => {
		formTouched.value = true;
	},
	{ deep: true }
);

const resizeImage = (
	file,
	maxWidth = 1200,
	maxHeight = 1200,
	quality = 0.7
) => {
	return new Promise((resolve) => {
		// Créer un élément Image pour charger le fichier
		const img = new Image();
		img.onload = () => {
			// Calcul des nouvelles dimensions tout en conservant le ratio
			let width = img.width;
			let height = img.height;

			if (width > height) {
				if (width > maxWidth) {
					height = Math.round((height * maxWidth) / width);
					width = maxWidth;
				}
			} else {
				if (height > maxHeight) {
					width = Math.round((width * maxHeight) / height);
					height = maxHeight;
				}
			}

			// Création d'un canvas pour redimensionner l'image
			const canvas = document.createElement("canvas");
			canvas.width = width;
			canvas.height = height;

			// Dessiner l'image redimensionnée
			const ctx = canvas.getContext("2d");
			ctx.drawImage(img, 0, 0, width, height);

			// Convertir en base64 avec compression
			const dataUrl = canvas.toDataURL("image/jpeg", quality);
			resolve(dataUrl);
		};

		// Charger l'image depuis le fichier
		img.src = URL.createObjectURL(file);
	});
};

const handleFileUpload = async (event) => {
	const files = event.target.files;
	if (!files.length) return;

	for (const file of Array.from(files)) {
		if (file.type.startsWith("image/")) {
			try {
				// Redimensionner l'image avant de l'ajouter
				const resizedImageData = await resizeImage(file);

				uploadedPhotos.value.push({
					id: Date.now() + Math.random().toString(36).substring(2),
					preview: resizedImageData,
					file: file,
				});
			} catch (error) {
				console.error("Erreur lors du traitement de l'image:", error);
			}
		}
	}
};

const removePhoto = (id) => {
	uploadedPhotos.value = uploadedPhotos.value.filter(
		(photo) => photo.id !== id
	);
};

const resetForm = () => {
	formSubmitted.value = false;
	formData.value = {
		name: "",
		email: "",
		phone: "",
		description: "",
		rgpdConsent: false,
	};
	uploadedPhotos.value = [];
	formTouched.value = false;
	showErrors.value = false;
};

const submitForm = async () => {
	formTouched.value = true;
	showErrors.value = true;

	if (!validateForm()) {
		const firstErrorElement = document.querySelector(".error-message");
		if (firstErrorElement) {
			firstErrorElement.scrollIntoView({ behavior: "smooth", block: "center" });
		}
		return;
	}

	isSubmitting.value = true;
	formError.value = null;

	try {
		// Préparation des données à envoyer à l'API
		const apiData = {
			name: formData.value.name,
			email: formData.value.email,
			phone: formData.value.phone,
			description: formData.value.description,
			photos: uploadedPhotos.value.map((photo) => ({
				preview: photo.preview,
			})),
		};

		// Appel à l'API avec meilleure gestion des erreurs
		const response = await fetch("/api/personalized-command", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(apiData),
		});

		// Vérification du statut HTTP avant de parser la réponse
		if (!response.ok) {
			let errorMessage;
			try {
				// Tente de lire la réponse d'erreur en JSON
				const errorData = await response.json();
				errorMessage =
					errorData.error ||
					`Erreur (${response.status}): ${response.statusText}`;
			} catch (jsonError) {
				// Si la réponse n'est pas du JSON valide
				errorMessage = `Erreur (${response.status}): ${response.statusText}`;
			}
			throw new Error(errorMessage);
		}

		// Parse la réponse JSON seulement si le statut est OK
		const result = await response.json();

		if (!result.success) {
			throw new Error(
				result.error || "Une erreur s'est produite lors de l'envoi"
			);
		}

		formSubmitted.value = true;
		emit("form-submitted", true);
	} catch (error) {
		formError.value =
			error.message || "Une erreur s'est produite. Veuillez réessayer.";
		console.error("Form submission error:", error);
	} finally {
		isSubmitting.value = false;
	}
};
</script>

<template>
	<div>
		<section
			v-if="formSubmitted"
			aria-labelledby="confirmation-title"
			class="bg-white/5 backdrop-blur-sm p-8 md:p-16 lg:p-24 md:mt-10 rounded-xl border border-white/10 lg:mx-6">
			<h2
				id="confirmation-title"
				class="text-3xl md:text-4xl lg:text-6xl font-apercuBold mb-8 md:mb-16">
				Merci pour votre demande
			</h2>
			<p class="text-xl md:text-2xl lg:text-4xl mb-8 md:mb-16">
				Votre demande a bien été reçue. Je vous contacterai très prochainement
				pour discuter des détails de votre projet.
			</p>
			<div class="flex justify-end">
				<button
					@click="resetForm"
					class="px-8 md:px-16 py-4 md:py-6 bg-white text-black font-apercuBold rounded-full hover:bg-white/90 transition-all duration-200 active:scale-98 cursor-pointer hover:scale-101 text-lg md:text-xl">
					Nouvelle demande
				</button>
			</div>
		</section>

		<form
			v-else
			@submit.prevent="submitForm"
			novalidate
			aria-labelledby="form-title">
			<h2
				id="form-title"
				class="text-3xl text-shadow md:text-4xl md:mt-10 lg:text-6xl font-apercuBold mb-16 md:mb-32 md:ml-24 lg:ml-14 lg:p-10 rounded-xl w-fit">
				Votre projet
			</h2>

			<div
				class="grid grid-cols-1 md:grid-cols-12 gap-x-6 gap-y-16 md:gap-y-32">
				<!-- Description du projet -->
				<section
					class="md:col-span-7 md:col-start-4 bg-white/5 backdrop-blur-sm p-6 md:p-10 lg:p-16 rounded-xl border border-white/10 lg:mx-6">
					<label
						for="description"
						class="block text-xl md:text-2xl font-apercuBold mb-4 md:mb-6">
						Votre vision <span class="text-yellow" aria-hidden="true">*</span
						><span class="sr-only">(requis)</span>
					</label>
					<textarea
						id="description"
						ref="descriptionTextarea"
						v-model="formData.description"
						rows="6"
						required
						aria-required="true"
						aria-describedby="description-error"
						placeholder="Décrivez votre projet..."
						class="w-full bg-transparent border-b border-white/30 px-4 py-4 md:py-6 focus:outline-none focus:border-white text-white text-lg md:text-2xl resize-none overflow-hidden"></textarea>
					<p
						v-if="showErrors && formErrors.description"
						id="description-error"
						class="error-message text-yellow mt-2 text-sm md:text-base">
						{{ formErrors.description }}
					</p>
				</section>

				<!-- Coordonnées -->
				<section
					class="md:col-span-5 md:col-start-2 bg-white/5 backdrop-blur-sm p-6 md:p-10 lg:p-16 rounded-xl border border-white/10 lg:mx-6"
					aria-labelledby="contact-info">
					<h3 id="contact-info" class="sr-only">Vos coordonnées</h3>
					<div class="mb-8 md:mb-12">
						<label
							for="name"
							class="block text-xl md:text-2xl font-apercuBold mb-4 md:mb-6">
							Nom complet <span class="text-yellow" aria-hidden="true">*</span
							><span class="sr-only">(requis)</span>
						</label>
						<input
							id="name"
							v-model="formData.name"
							type="text"
							required
							aria-required="true"
							aria-describedby="name-error"
							class="w-full bg-transparent border-b border-white/30 px-4 py-4 md:py-6 focus:outline-none focus:border-white text-white text-lg md:text-2xl" />
						<p
							v-if="showErrors && formErrors.name"
							id="name-error"
							class="error-message text-yellow mt-2 text-sm md:text-base">
							{{ formErrors.name }}
						</p>
					</div>

					<div class="mb-8 md:mb-12">
						<label
							for="email"
							class="block text-xl md:text-2xl font-apercuBold mb-4 md:mb-6">
							Email <span class="text-yellow" aria-hidden="true">*</span
							><span class="sr-only">(requis)</span>
						</label>
						<input
							id="email"
							v-model="formData.email"
							type="email"
							required
							aria-required="true"
							aria-describedby="email-error"
							class="w-full bg-transparent border-b border-white/30 px-4 py-4 md:py-6 focus:outline-none focus:border-white text-white text-lg md:text-2xl" />
						<p
							v-if="showErrors && formErrors.email"
							id="email-error"
							class="error-message text-yellow mt-2 text-sm md:text-base">
							{{ formErrors.email }}
						</p>
					</div>

					<div>
						<label
							for="phone"
							class="block text-xl md:text-2xl font-apercuBold mb-4 md:mb-6">
							Téléphone
						</label>
						<input
							id="phone"
							v-model="formData.phone"
							type="tel"
							autocomplete="tel"
							class="w-full bg-transparent border-b border-white/30 px-4 py-4 md:py-6 focus:outline-none focus:border-white text-white text-lg md:text-2xl" />
					</div>
				</section>

				<!-- Comment ça marche -->
				<section
					class="md:col-span-7 text-shadow md:col-start-6 py-6 md:py-10 rounded-xl lg:ml-30 2xl:ml-40"
					aria-labelledby="process-title">
					<h3
						id="process-title"
						class="text-2xl md:text-3xl font-apercuBold mb-8 md:mb-12">
						Comment ça fonctionne
					</h3>
					<ol class="space-y-6 md:space-y-8 text-lg md:text-2xl">
						<li class="flex gap-4 md:gap-6">
							<span
								class="inline-block bg-white/10 h-10 w-10 md:h-12 md:w-12 rounded-full text-center leading-loose flex-shrink-0"
								aria-hidden="true"
								>1</span
							>
							<span>Envoyez votre demande via ce formulaire</span>
						</li>
						<li class="flex gap-4 md:gap-6">
							<span
								class="inline-block bg-white/10 h-10 w-10 md:h-12 md:w-12 rounded-full text-center leading-loose flex-shrink-0"
								aria-hidden="true"
								>2</span
							>
							<span
								>Discussion pour préciser votre projet et étudier sa
								faisabilité</span
							>
						</li>
						<li class="flex gap-4 md:gap-6">
							<span
								class="inline-block bg-white/10 h-10 w-10 md:h-12 md:w-12 rounded-full text-center leading-loose flex-shrink-0"
								aria-hidden="true"
								>3</span
							>
							<span
								>Un acompte de 30% sera demandé pour débuter le travail</span
							>
						</li>
						<li class="flex gap-4 md:gap-6">
							<span
								class="inline-block bg-white/10 h-10 w-10 md:h-12 md:w-12 rounded-full text-center leading-loose flex-shrink-0"
								aria-hidden="true"
								>4</span
							>
							<span
								>Réception de votre œuvre unique après validation et solde</span
							>
						</li>
					</ol>
				</section>

				<!-- Upload de photos -->
				<section
					class="md:col-span-10 md:col-start-1 bg-white/5 backdrop-blur-sm p-6 md:p-10 lg:p-16 rounded-xl border border-white/10 lg:mx-6"
					aria-labelledby="photos-title">
					<h3
						id="photos-title"
						class="text-xl md:text-2xl font-apercuBold mb-6 md:mb-10">
						Photos de référence
						<span class="text-yellow" aria-hidden="true">*</span
						><span class="sr-only">(requis)</span>
					</h3>

					<div
						class="border-2 border-dashed border-white/30 rounded-xl text-center transition-colors duration-300 hover:border-white/60"
						:class="{ 'border-yellow': showErrors && formErrors.photos }">
						<input
							type="file"
							id="photo-upload"
							multiple
							@change="handleFileUpload"
							accept="image/*"
							aria-describedby="photos-error"
							aria-required="true"
							class="hidden" />

						<label
							for="photo-upload"
							class="cursor-pointer flex flex-col items-center justify-center py-16 md:py-32 group px-16 md:px-32 w-full h-full">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-14 w-14 md:h-20 md:w-20 mb-4 md:mb-8 transition-transform duration-300 group-hover:scale-110 group-active:scale-95 cursor-pointer"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
								aria-hidden="true">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="1.5"
									d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
							</svg>
							<p class="text-xl md:text-3xl mb-2 md:mb-4">
								Cliquez pour ajouter des photos
							</p>
							<p class="text-base md:text-xl opacity-60">
								Sujets, inspirations, ambiances...
							</p>
						</label>
					</div>

					<p
						v-if="showErrors && formErrors.photos"
						id="photos-error"
						class="error-message text-yellow mt-2 text-sm md:text-base">
						{{ formErrors.photos }}
					</p>

					<transition-group
						v-show="uploadedPhotos.length > 0"
						mode="out-in"
						name="photo-grid"
						tag="div"
						class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8 mt-8 md:mt-12"
						aria-live="polite">
						<div
							v-for="photo in uploadedPhotos"
							:key="photo.id"
							class="relative rounded-lg overflow-hidden aspect-square shadow-md transition-all duration-300 hover:shadow-xl hover:scale-[1.03]">
							<NuxtImg
								:src="photo.preview"
								:alt="`Photo de référence téléchargée`"
								loading="lazy"
								class="w-full h-full object-cover" />
							<button
								@click="removePhoto(photo.id)"
								type="button"
								aria-label="Supprimer cette photo"
								class="absolute top-2 right-2 md:top-4 md:right-4 bg-black/60 p-1 md:p-2 rounded-full hover:bg-black/90 hover:rotate-90 transition-all duration-200 active:scale-95 transform cursor-pointer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4 md:h-6 md:w-6"
									viewBox="0 0 20 20"
									fill="currentColor"
									aria-hidden="true">
									<path
										fill-rule="evenodd"
										d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
										clip-rule="evenodd" />
								</svg>
							</button>
						</div>
					</transition-group>
				</section>

				<!-- RGPD -->
				<section
					class="md:col-span-9 lg:col-span-8 2xl:col-span-6 md:col-start-3 rounded-xl lg:p-6 mt-4 md:mt-8">
					<div class="flex gap-x-3 items-start">
						<div class="relative mt-1">
							<input
								class="sr-only"
								id="rgpd"
								type="checkbox"
								v-model="formData.rgpdConsent"
								required
								aria-required="true"
								aria-describedby="rgpd-error" />
							<label
								class="block w-6 h-6 md:w-8 md:h-8 border-2 rounded-md bg-white/5 border-white/30 cursor-pointer transition-all relative"
								for="rgpd"
								aria-hidden="true">
								<span
									class="absolute inset-0 flex items-center justify-center text-white opacity-0 transition-opacity"
									:class="{ 'opacity-100': formData.rgpdConsent }">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4 md:h-5 md:w-5"
										viewBox="0 0 20 20"
										fill="currentColor"
										aria-hidden="true">
										<path
											fill-rule="evenodd"
											d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
											clip-rule="evenodd" />
									</svg>
								</span>
							</label>
						</div>
						<label
							for="rgpd"
							class="cursor-pointer text-white text-base md:text-xl">
							J'accepte que mes données personnelles soient utilisées uniquement
							dans le cadre de ma demande de commande personnalisée. Ces données
							ne seront pas partagées avec des tiers et seront conservées selon
							la politique de confidentialité.
							<span class="text-yellow" aria-hidden="true">*</span
							><span class="sr-only">(requis)</span>
						</label>
					</div>
					<p
						v-if="showErrors && formErrors.rgpdConsent"
						id="rgpd-error"
						class="error-message text-yellow mt-2 ml-9 text-sm md:text-base">
						{{ formErrors.rgpdConsent }}
					</p>
				</section>

				<!-- Required fields info -->
				<div class="md:col-span-3 md:col-start-3 mx-6">
					<p class="text-sm rounded-xl w-fit lg:p-8 md:text-base text-white/60">
						<span class="text-yellow" aria-hidden="true">*</span> Champs
						obligatoires
					</p>
				</div>

				<!-- Submit button -->
				<div
					class="md:col-span-3 md:col-start-9 flex justify-end lg:mx-6 md:mt-8">
					<div
						class="w-fit transition-transform duration-200 active:scale-98 hover:scale-101 cursor-pointer">
						<button
							type="submit"
							:disabled="isSubmitting"
							:class="[
								'px-8 md:px-16 py-4 md:py-6 text-black font-apercuBold rounded-full transition-all whitespace-nowrap text-lg md:text-2xl',
								buttonState === 'submitting'
									? 'bg-white/70 animate-pulse cursor-not-allowed'
									: buttonState === 'ready'
									? 'bg-white hover:bg-white/90'
									: 'bg-white/80 hover:bg-white/90',
							]">
							<span v-if="isSubmitting">Envoi en cours...</span>
							<span v-else>Envoyer ma demande</span>
						</button>
					</div>
				</div>
			</div>

			<div
				v-if="formError"
				class="mt-8 md:mt-16 p-6 md:p-10 bg-red-500/10 border border-red-500/30 rounded-md text-center lg:mx-6 text-lg md:text-xl"
				role="alert"
				aria-live="assertive">
				{{ formError }}
			</div>
		</form>
	</div>
</template>

<style scoped>
input,
textarea {
	transition: all 0.3s ease;
}

input:focus,
textarea:focus {
	background-color: rgba(255, 255, 255, 0.03);
}

.photo-grid-enter-active,
.photo-grid-leave-active {
	transition: all 0.3s ease;
}

.photo-grid-enter-from {
	opacity: 0;
	transform: scale(0.8);
}

.photo-grid-leave-to {
	opacity: 0;
	transform: scale(0.5);
}

.photo-grid-move {
	transition: transform 0.3s ease;
}

@keyframes pulse {
	0%,
	100% {
		opacity: 1;
	}
	50% {
		opacity: 0.7;
	}
}

button[type="submit"]:disabled {
	animation: pulse 2s infinite;
}

input[type="checkbox"] + label {
	transition: all 0.3s ease;
}

input[type="checkbox"]:checked + label {
	background-color: rgba(255, 255, 255, 0.2);
	border-color: rgba(255, 255, 255, 0.7);
}

input[type="checkbox"]:focus + label {
	box-shadow: 0 0 0 2px rgba(255, 255, 255, 0.4);
}
</style>
