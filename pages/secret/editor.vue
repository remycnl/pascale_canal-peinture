<template>
	<div
		class="relative min-h-screen"
		:class="{ 'overflow-hidden': !isSecretPage }">
		<!-- Page principale du formulaire -->
		<div v-if="isSecretPage" class="container">
			<h1 class="text-3xl font-bold mb-8 text-center text-gray-800">
				Ajouter une peinture
			</h1>

			<form
				@submit.prevent="submitPainting"
				class="max-w-2xl mx-auto bg-black p-8 rounded-2xl shadow-lg">
				<div class="grid gap-6">
					<!-- Nom -->
					<div class="form-group">
						<label for="name" class="label">Nom</label>
						<input
							v-model="name"
							@input="generateSlug"
							id="name"
							class="input"
							required />
					</div>

					<!-- Prix -->
					<div class="form-group">
						<label for="price" class="label">Prix</label>
						<div class="relative">
							<input
								v-model="price"
								id="price"
								type="number"
								class="input pl-8"
								required />
						</div>
					</div>

					<!-- Image Upload Personnalisé -->
					<div class="form-group">
						<label for="image" class="label">Image</label>
						<div class="relative">
							<input
								@change="handleImageUpload"
								type="file"
								id="image"
								accept="image/*"
								class="hidden"
								required />
							<label
								for="image"
								class="cursor-pointer flex items-center justify-center w-full px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all">
								<span class="mr-2">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
									</svg>
								</span>
								<span class="text-gray-600">
									{{
										selectedImage
											? selectedImage.name
											: "Sélectionner une image"
									}}
								</span>
							</label>
						</div>
						<p v-if="selectedImage" class="text-sm text-gray-500 mt-1">
							Taille: {{ formatFileSize(selectedImage.size) }}
						</p>
					</div>

					<!-- Type -->
					<div class="form-group">
						<label for="type" class="label">Type</label>
						<input v-model="type" id="type" class="input" required />
					</div>

					<!-- Slug (en lecture seule) -->
					<div class="form-group">
						<label for="slug" class="label">Slug</label>
						<input
							v-model="slug"
							id="slug"
							class="input bg-gray-100"
							readonly />
					</div>

					<!-- État -->
					<div class="form-group">
						<label for="state" class="label">État</label>
						<select v-model="state" class="input">
							<option value="FOR_SALE">À vendre</option>
							<option value="SOLD">Vendue</option>
						</select>
					</div>

					<!-- Date -->
					<div class="form-group">
						<label for="date" class="label">Date de création</label>
						<input
							v-model="date"
							id="date"
							type="date"
							class="input"
							required />
					</div>
				</div>

				<button
					type="submit"
					class="w-full mt-8 bg-yellow text-black py-3 px-6 rounded-lg hover:bg-opacity-70 transition-all duration-300">
					Ajouter la peinture
				</button>
			</form>
		</div>

		<!-- Modal d'authentification -->
		<div v-else class="modal">
			<div class="modal-content">
				<h2 class="text-2xl font-apercuBold mb-4">
					Entrez le mot de passe pour accéder à cette page
				</h2>
				<form @submit.prevent="checkSecretKey">
					<div class="mb-4">
						<label for="secretKey" class="sr-only">Mot de passe</label>
						<input
							v-model="secretKeyInput"
							id="secretKey"
							type="password"
              autocomplete="new-password"
							placeholder="Saisir la clé"
							class="input mb-4 text-black"
							required />
					</div>
					<button
						type="submit"
						class="w-full bg-yellow text-black py-2 px-4 rounded-lg hover:bg-opacity-70 transition-all duration-300">
						Valider
					</button>
				</form>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRuntimeConfig } from "nuxt/app";
const { $initializeSmoothScroll } = useNuxtApp();

// Configuration et variables d'état
const config = useRuntimeConfig();
const secretKey = config.public.NUXT_SECRET_KEY;

// Refs pour les champs du formulaire
const secretKeyInput = ref("");
const isSecretPage = ref(false);
const name = ref("");
const price = ref("");
const selectedImage = ref(null);
const type = ref("");
const slug = ref("");
const state = ref("FOR_SALE");

// Fonction pour formater la date
const formatDate = (date) => date.toISOString().split("T")[0];
const date = ref(formatDate(new Date()));

// Fonction pour formater la taille du fichier
const formatFileSize = (bytes) => {
	if (bytes === 0) return "0 Bytes";
	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Gestion de l'upload d'image
const handleImageUpload = (event) => {
	const file = event.target.files[0];
	if (file) {
		selectedImage.value = file;
	}
};

// Génération automatique du slug
const generateSlug = () => {
	if (name.value) {
		slug.value = name.value
			.toLowerCase()
			.replace(/[éèê]/g, "e")
			.replace(/[àâ]/g, "a")
			.replace(/[ùû]/g, "u")
			.replace(/[ôö]/g, "o")
			.replace(/[îï]/g, "i")
			.replace(/[ç]/g, "c")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");
	}
};

// Fonction pour désactiver le scroll
const disableScroll = () => {
	document.body.style.overflow = "hidden";
	document.body.style.height = "100vh";
};

// Fonction pour réactiver le scroll
const enableScroll = () => {
  console.log("enableScroll");
	document.body.style.overflow = "auto";
	document.body.style.height = "auto";
  if ($initializeSmoothScroll) {
    $initializeSmoothScroll();
  }
};

// Vérification du mot de passe
const checkSecretKey = () => {
	if (secretKeyInput.value === secretKey) {
		isSecretPage.value = true;
		enableScroll();
	} else {
		alert("Mot de passe incorrect");
	}
};

// Gestion du scroll au montage/démontage
onMounted(() => {
	if (!isSecretPage.value) {
		disableScroll();
	}
});

onUnmounted(() => {
	enableScroll();
});

// Soumission du formulaire
const submitPainting = async () => {
	try {
		const formData = new FormData();
		formData.append("image", selectedImage.value);
		formData.append("name", name.value);
		formData.append("price", price.value);
		formData.append("type", type.value);
		formData.append("slug", slug.value);
		formData.append("state", state.value);
		formData.append("date", date.value);

		const response = await $fetch("/api/secret/add", {
			method: "POST",
			body: formData,
		});

		alert("Peinture ajoutée avec succès");
		resetForm();
	} catch (error) {
		console.error(error);
		alert("Erreur lors de l'ajout de la peinture");
	}
};

// Réinitialisation du formulaire
const resetForm = () => {
	name.value = "";
	price.value = "";
	selectedImage.value = null;
	type.value = "";
	slug.value = "";
	state.value = "FOR_SALE";
	date.value = formatDate(new Date());
};
</script>

<style scoped>
.form-group {
	@apply flex flex-col gap-2;
}

.label {
	@apply text-sm font-medium text-white text-opacity-80;
}

.input {
	@apply w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow focus:border-yellow outline-none transition-all;
}

.modal {
	@apply w-full flex items-center justify-center;
}

.modal-content {
	@apply bg-black text-white p-8 rounded-2xl shadow-xl max-w-md w-full;
}
</style>