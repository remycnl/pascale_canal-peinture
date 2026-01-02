<script setup>
import { ref, onMounted, computed } from "vue";

const posterSizes = ref([]);
const isLoading = ref(false);
const newPosterSize = ref({
	name: '',
	width: '',
	height: '',
	price: '',
	order: 0
});
const showAddForm = ref(false);

// Trier les tailles par ordre
const sortedPosterSizes = computed(() => {
	return [...(posterSizes.value || [])].sort(
		(a, b) => (a.order || 0) - (b.order || 0)
	);
});

// Charger les tailles de posters
const loadPosterSizes = async () => {
	try {
		const response = await $fetch("/api/secret/global-poster-sizes");
		posterSizes.value = response.posterSizes || [];
	} catch (error) {
		console.error("Erreur lors du chargement des tailles de posters:", error);
		alert("Erreur lors du chargement des tailles de posters");
	}
};

// Ajouter une nouvelle taille
const addPosterSize = async () => {
	if (!newPosterSize.value.name || !newPosterSize.value.width || !newPosterSize.value.height || !newPosterSize.value.price) {
		alert("Veuillez remplir tous les champs obligatoires");
		return;
	}

	try {
		isLoading.value = true;
		
		// Calculer automatiquement l'ordre suivant
		const maxOrder = posterSizes.value.length > 0 
			? Math.max(...posterSizes.value.map(size => size.order || 0))
			: -1;
		
		const posterSizeToAdd = {
			...newPosterSize.value,
			order: maxOrder + 1,
			isActive: true
		};
		
		await $fetch("/api/secret/global-poster-sizes", {
			method: "POST",
			body: posterSizeToAdd
		});
		
		// Réinitialiser le formulaire
		newPosterSize.value = {
			name: '',
			width: '',
			height: '',
			price: '',
			order: 0
		};
		showAddForm.value = false;
		
		// Recharger la liste
		await loadPosterSizes();
		alert("Taille de poster ajoutée avec succès");
	} catch (error) {
		console.error("Erreur lors de l'ajout de la taille de poster:", error);
		alert("Erreur lors de l'ajout de la taille de poster");
	} finally {
		isLoading.value = false;
	}
};

// Sauvegarder les modifications
const savePosterSizes = async () => {
	try {
		isLoading.value = true;
		// Nettoyer et typer les objets avant envoi
		const cleanPosterSizes = posterSizes.value.map(size => ({
			id: size.id,
			name: size.name,
			width: parseFloat(size.width),
			height: parseFloat(size.height),
			price: parseFloat(size.price),
			order: parseInt(size.order),
			isActive: size.isActive // Garder la valeur actuelle sans forcer à true
		}));
		await $fetch("/api/secret/global-poster-sizes", {
			method: "PUT",
			body: { posterSizes: cleanPosterSizes }
		});
		alert("Tailles de posters mises à jour avec succès");
	} catch (error) {
		console.error("Erreur lors de la sauvegarde:", error);
		alert("Erreur lors de la sauvegarde des tailles de posters");
	} finally {
		isLoading.value = false;
	}
};

// Supprimer une taille
const deletePosterSize = async (posterSize) => {
	if (confirm(`Êtes-vous sûr de vouloir supprimer la taille "${posterSize.name}" ?`)) {
		try {
			await $fetch(`/api/secret/global-poster-sizes/${posterSize.id}`, {
				method: "DELETE"
			});
			await loadPosterSizes();
			alert("Taille de poster supprimée avec succès");
		} catch (error) {
			console.error("Erreur lors de la suppression:", error);
			alert("Erreur lors de la suppression de la taille de poster");
		}
	}
};

// Déplacer vers le haut
const moveUp = async (posterSize, index) => {
	if (index > 0) {
		const prevPosterSize = sortedPosterSizes.value[index - 1];

		const tempOrder = posterSize.order;
		posterSize.order = prevPosterSize.order;
		prevPosterSize.order = tempOrder;

		await savePosterSizes();
	}
};

// Déplacer vers le bas
const moveDown = async (posterSize, index) => {
	if (index < sortedPosterSizes.value.length - 1) {
		const nextPosterSize = sortedPosterSizes.value[index + 1];

		const tempOrder = posterSize.order;
		posterSize.order = nextPosterSize.order;
		nextPosterSize.order = tempOrder;

		await savePosterSizes();
	}
};

// Formater le prix
const formatPrice = (price) => {
	return new Intl.NumberFormat("fr-FR").format(price);
};

onMounted(() => {
	loadPosterSizes();
});
</script>


<template>
	<div
		class="mt-20 md:mt-40 flex flex-col gap-y-10 md:gap-y-30 justify-center items-center">
		<div class="w-full flex items-center mb-8">
			<div
				class="grow h-0.5 bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
			<div class="mx-2 sm:mx-4">
				<NuxtImg
					src="/img/logo.png"
					alt="Logo"
					title="Logo"
					format="webp"
					class="w-16 sm:w-20 md:w-28 h-auto" />
			</div>
			<div
				class="grow h-0.5 bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
		</div>
		<div class="w-full max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
			<div class="bg-black text-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center">
				<h2 class="text-2xl sm:text-3xl font-apercuBold mb-4 sm:mb-0">
					Configuration des posters
				</h2>
				<button
					@click="showAddForm = !showAddForm"
					class="bg-yellow active:scale-95 text-black px-4 py-2 rounded-lg hover:bg-yellow/90 transition-all duration-200 flex items-center cursor-pointer">
					<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clip-rule="evenodd"/></svg>
					{{ showAddForm ? 'Annuler' : 'Ajouter une taille' }}
				</button>
			</div>
			<div class="bg-white p-6">
				<p class="text-sm text-gray-600 mb-6">
					Ces tailles seront disponibles pour toutes les peintures en format poster. Les posters sont toujours disponibles, même si l'original n'est plus en vente.
				</p>

				<!-- Formulaire d'ajout -->
				<div v-if="showAddForm" class="bg-gray-50 p-4 rounded-xl mb-6 border border-gray-200">
					<h4 class="font-apercuBold text-gray-800 mb-4">Ajouter une nouvelle taille</h4>
					<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
						<div>
							<label for="new-name" class="block text-sm font-apercuMedium text-gray-700 mb-1">Nom</label>
							<input v-model="newPosterSize.name" id="new-name" type="text" placeholder="Grand, Moyen, Petit..." class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent text-black" required />
						</div>
						<div>
							<label for="new-width" class="block text-sm font-apercuMedium text-gray-700 mb-1">Largeur (cm)</label>
							<input v-model="newPosterSize.width" id="new-width" type="number" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent text-black" required />
						</div>
						<div>
							<label for="new-height" class="block text-sm font-apercuMedium text-gray-700 mb-1">Hauteur (cm)</label>
							<input v-model="newPosterSize.height" id="new-height" type="number" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent text-black" required />
						</div>
						<div>
							<label for="new-price" class="block text-sm font-apercuMedium text-gray-700 mb-1">Prix (€)</label>
							<input v-model="newPosterSize.price" id="new-price" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent text-black" required />
						</div>
					</div>
					<div class="flex gap-2 mt-4">
						<button @click="addPosterSize" :disabled="isLoading" class="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 active:scale-95 transition-all duration-200 cursor-pointer disabled:opacity-50">{{ isLoading ? 'Ajout...' : 'Ajouter' }}</button>
						<button @click="showAddForm = false" class="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 active:scale-95 transition-all duration-200 cursor-pointer">Annuler</button>
					</div>
				</div>

				<!-- Liste des tailles existantes -->
				<div v-if="sortedPosterSizes.length === 0" class="text-center py-16 text-gray-500">
					Aucune taille de poster configurée
				</div>

				<div v-else class="divide-y max-h-[70vh] overflow-y-auto divide-gray-200">
					<div v-for="(posterSize, index) in sortedPosterSizes" :key="posterSize.id" class="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors group relative">
						<div class="absolute top-4 right-4">
							<button
								@click="deletePosterSize(posterSize)"
								class="text-red-500 hover:text-red-700 active:scale-95 transition-colors duration-200 cursor-pointer">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-6 w-6"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor">
									<path
										stroke-linecap="round"
										stroke-linejoin="round"
										stroke-width="2"
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
								</svg>
							</button>
						</div>

						<div
							class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
							<div
								class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
								<div class="flex space-x-2 bg-gray-100 p-1 rounded-lg">
									<button
										@click="moveUp(posterSize, index)"
										:disabled="index === 0"
										class="p-2 rounded-md active:scale-95 transition-colors duration-200 cursor-pointer"
										:class="
											index === 0
												? 'text-gray-300'
												: 'text-gray-600 hover:bg-gray-200'
										">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
												clip-rule="evenodd" />
										</svg>
									</button>
									<button
										@click="moveDown(posterSize, index)"
										:disabled="index === sortedPosterSizes.length - 1"
										class="p-2 rounded-md active:scale-95 transition-colors duration-200 cursor-pointer"
										:class="
											index === sortedPosterSizes.length - 1
												? 'text-gray-300'
												: 'text-gray-600 hover:bg-gray-200'
										">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-4 w-4"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												fill-rule="evenodd"
												d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
												clip-rule="evenodd" />
										</svg>
									</button>
									<span
										class="text-xs font-apercuMedium text-gray-500 flex items-center bg-gray-200 px-2 py-1 rounded-md ml-2"
										>Position: {{ index + 1 }}</span
									>
								</div>
								<div class="flex items-center space-x-2">
									<span class="text-xs font-apercuMedium" :class="posterSize.isActive ? 'text-green-500' : 'text-gray-400'">
										{{ posterSize.isActive ? 'Active' : 'Inactive' }}
									</span>
									<label class="switch">
										<input v-model="posterSize.isActive" type="checkbox" />
										<span class="slider"></span>
									</label>
								</div>
							</div>
						</div>

						<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
							<div>
								<label :for="`name-${index}`" class="block text-sm font-apercuMedium text-gray-700 mb-1">Nom</label>
								<input v-model="posterSize.name" :id="`name-${index}`" type="text" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent text-black" />
							</div>
							<div>
								<label :for="`width-${index}`" class="block text-sm font-apercuMedium text-gray-700 mb-1">Largeur (cm)</label>
								<input v-model="posterSize.width" :id="`width-${index}`" type="number" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent text-black" />
							</div>
							<div>
								<label :for="`height-${index}`" class="block text-sm font-apercuMedium text-gray-700 mb-1">Hauteur (cm)</label>
								<input v-model="posterSize.height" :id="`height-${index}`" type="number" step="0.1" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent text-black" />
							</div>
							<div>
								<label :for="`price-${index}`" class="block text-sm font-apercuMedium text-gray-700 mb-1">Prix (€)</label>
								<input v-model="posterSize.price" :id="`price-${index}`" type="number" step="0.01" class="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow focus:border-transparent text-black" />
							</div>
						</div>

						<div class="mt-2 text-xs text-gray-400 flex justify-between items-center">
							<span></span>
						</div>
					</div>
				</div>

				<!-- Bouton de sauvegarde -->
				<div v-if="sortedPosterSizes.length > 0" class="flex justify-center mt-6">
					<button @click="savePosterSizes" :disabled="isLoading" class="bg-yellow text-black py-3 px-8 rounded-lg hover:bg-yellow/80 active:scale-95 transition-all duration-200 cursor-pointer font-apercuBold disabled:opacity-50">
						{{ isLoading ? 'Sauvegarde...' : 'Sauvegarder les modifications' }}
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.switch {
	position: relative;
	display: inline-block;
	width: 2.8em;
	height: 1.4em;
}

.switch input {
	display: none;
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--color-black);
	transition: 0.2s;
	border-radius: 30px;
}

.slider:before {
	position: absolute;
	content: "";
	height: 1em;
	width: 1em;
	border-radius: 20px;
	left: 0.2em;
	bottom: 0.2em;
	background-color: #aeaaae;
	transition: 0.4s;
}

input:checked + .slider::before {
	background-color: var(--color-yellow);
}

input:checked + .slider {
	background-color: #7c7541;
}

input:focus + .slider {
	box-shadow: 0 0 1px #7c7541;
}

input:checked + .slider:before {
	transform: translateX(1.4em);
}
</style>
			<!-- Bouton de sauvegarde -->
