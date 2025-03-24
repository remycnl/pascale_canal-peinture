<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchQuery = ref("");
const suggestions = ref([]);
const allTables = ref([]);
const isInputFocused = ref(false);
const preventBlurEvent = ref(false);
const isMobile = ref(false);

const checkScreenSize = () => {
	isMobile.value = window.innerWidth < 768;
};

const bubbleWidthClass = computed(() => {
	if (isMobile.value) {
		return "w-full";
	} else {
		return isInputFocused.value ? "w-150" : "w-120";
	}
});

const bubblePaddingClass = computed(() => {
	if (isMobile.value) {
		return "px-1.5";
	} else {
		return isInputFocused.value ? "pl-8" : "pl-4";
	}
});

// Fonction pour remonter en haut de la page
const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};

// Normalisation de texte pour ignorer la casse et les accents
const normalizeText = (text) => {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, ""); // Supprime les accents
};

// Fonction pour rechercher dans les tableaux
const searchTables = () => {
	if (searchQuery.value.length < 1) {
		suggestions.value = [];
		return;
	}

	const normalizedQuery = normalizeText(searchQuery.value);
	suggestions.value = allTables.value
		.filter((table) => normalizeText(table.name).includes(normalizedQuery))
		.slice(0, 5); // Limiter à 5 suggestions
};

// Empêcher l'événement de blur lors du clic sur une suggestion
const preventBlur = () => {
	preventBlurEvent.value = true;
};

// Gestion du blur avec délai pour permettre le clic sur les suggestions
const handleBlur = () => {
	setTimeout(() => {
		if (!preventBlurEvent.value) {
			isInputFocused.value = false;
			suggestions.value = [];
		}
		preventBlurEvent.value = false;
	}, 150);
};

// Fonction pour sélectionner une suggestion
const selectSuggestion = (suggestion) => {
	searchQuery.value = suggestion.name;
	navigateToTable();
	isInputFocused.value = false;
	suggestions.value = [];
};

// Fonction pour naviguer vers la page du tableau
const navigateToTable = () => {
	const normalizedQuery = normalizeText(searchQuery.value);

	const selectedTable = allTables.value.find(
		(table) => normalizeText(table.name) === normalizedQuery
	);

	if (selectedTable) {
		router.push(`/${selectedTable.slug}`);
		searchQuery.value = "";
		suggestions.value = [];
	}
};

onMounted(async () => {
	try {
		const response = await fetch("/api/allPaintings");
		allTables.value = await response.json();
	} catch (error) {
		console.error("Erreur lors de la récupération des tableaux:", error);
	}

	// Initialiser et surveiller les changements de taille d'écran
	checkScreenSize();
	window.addEventListener("resize", checkScreenSize);
});
</script>

<template>
	<div class="flex justify-center w-full">
		<div
			:class="[
				bubbleWidthClass,
				bubblePaddingClass,
				{
					'hover:scale-100': isInputFocused,
					'hover:scale-105': !isInputFocused && !isMobile,
					'max-w-screen-sm mx-4': isMobile,
				},
			]"
			class="z-50 h-fit origin-center bg-[#000000] rounded-full fixed bottom-5 py-1.5 md:py-2 pr-1.5 md:pr-2 transition-all duration-500">
			<div class="flex justify-between items-center gap-x-5 sm:gap-x-10 md:gap-x-8">
				<NuxtImg
					src="/img/logo-reversed.png"
					alt="Logo"
					class="w-auto ml-2 md:ml-0 h-6 md:h-7"
					:class="{ hidden: isMobile && isInputFocused }" />
				<div
					class="relative flex justify-between items-center gap-x-2 flex-grow">
					<div class="relative flex-grow">
						<input
							v-model="searchQuery"
							@keyup.enter="navigateToTable"
							@input="searchTables"
							@focus="isInputFocused = true"
							@blur="handleBlur"
							placeholder="Rechercher un tableau..."
							class="w-full px-3 py-1.5 md:py-2 text-sm text-gray-200 bg-black rounded-full focus:outline-none" />
						<div
							v-if="suggestions.length > 0"
							class="absolute w-full bottom-full p-2 mb-3 bg-[#000000] rounded-2xl z-10">
							<ul>
								<li
									v-for="suggestion in suggestions"
									:key="suggestion.id"
									@click="selectSuggestion(suggestion)"
									@mousedown="preventBlur"
									class="px-3 py-2 text-sm text-white hover:bg-black rounded-lg cursor-pointer">
									{{ suggestion.name }}
								</li>
							</ul>
						</div>
					</div>

					<div
						class="hidden md:block text-black md:text-sm px-3 md:px-5 py-2 bg-yellow hover:bg-yellow/85 active:scale-95 rounded-full cursor-pointer transition-all duration-300 whitespace-nowrap"
						:class="{ hidden: isMobile && isInputFocused }"
						@click="scrollToTop">
						Retour en haut
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
::selection {
	background-color: var(--color-white);
	color: var(--color-black);
}

@media (max-width: 640px) {
	.z-50 {
		width: calc(100% - 2rem);
		max-width: 100%;
	}
}
</style>
