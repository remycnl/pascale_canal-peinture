<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchQuery = ref("");
const suggestions = ref([]);
const isInputFocused = ref(false);
const preventBlurEvent = ref(false);
const isMobile = ref(false);
const imageLoading = ref({});

const setImageLoaded = (id) => {
	imageLoading.value[id] = false;
};

const watchSuggestions = (newSuggestions) => {
	newSuggestions.forEach((suggestion) => {
		if (imageLoading.value[suggestion.id] === undefined) {
			imageLoading.value[suggestion.id] = true;
		}
	});
};

watch(() => suggestions.value, watchSuggestions, { immediate: true });

const checkScreenSize = () => {
	isMobile.value = window.innerWidth < 768;
};

const { data: allTables } = await useFetch("/api/allPaintings");

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

const scrollToTop = () => {
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
};

const normalizeText = (text) => {
	return text
		.toLowerCase()
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "");
};

const searchTables = () => {
	if (searchQuery.value.length < 1) {
		suggestions.value = [];
		return;
	}

	const normalizedQuery = normalizeText(searchQuery.value);
	suggestions.value = allTables.value
		.filter((table) => normalizeText(table.name).includes(normalizedQuery))
		.slice(0, 5);
};

const preventBlur = () => {
	preventBlurEvent.value = true;
};

const handleBlur = () => {
	setTimeout(() => {
		if (!preventBlurEvent.value) {
			isInputFocused.value = false;
			suggestions.value = [];
		}
		preventBlurEvent.value = false;
	}, 150);
};

const selectSuggestion = (suggestion) => {
	searchQuery.value = suggestion.name;
	navigateToTable();
	isInputFocused.value = false;
	suggestions.value = [];
};

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

onMounted(() => {
	checkScreenSize();
	window.addEventListener("resize", checkScreenSize);
});
</script>

<template>
	<div class="flex justify-center w-full">
		<nav
			:class="[
				bubbleWidthClass,
				bubblePaddingClass,
				{
					'hover:scale-100': isInputFocused,
					'hover:scale-105': !isInputFocused && !isMobile,
					'max-w-screen-sm mx-4': isMobile,
				},
			]"
			class="z-50 h-fit origin-center bg-[#000000] rounded-full fixed bottom-5 py-1.5 md:py-2 pr-1.5 md:pr-2 transition-all duration-500"
			aria-label="Navigation et recherche">
			<div
				class="flex justify-between items-center gap-x-5 sm:gap-x-10 md:gap-x-8">
				<NuxtImg
					src="/img/logo-reversed.png"
					alt="Pascale Canal Peintures Logo"
					title="Logo Pascale Canal Peintures"
					format="webp"
					class="w-auto ml-2 md:ml-0 h-6 md:h-7"
					:class="{ hidden: isMobile && isInputFocused }" />
				<div
					class="relative flex justify-between items-center gap-x-2 grow">
					<div class="relative grow">
						<form role="search" @submit.prevent="navigateToTable">
							<label for="painting-search" class="sr-only"
								>Rechercher un tableau</label
							>
							<input
								id="painting-search"
								v-model="searchQuery"
								@keyup.enter="navigateToTable"
								@input="searchTables"
								@focus="isInputFocused = true"
								@blur="handleBlur"
								placeholder="Rechercher un tableau..."
								:aria-expanded="isInputFocused"
								aria-autocomplete="list"
								:aria-controls="suggestions.length > 0 ? 'search-results' : undefined"
								class="w-full px-3 py-1.5 md:py-2 text-sm text-gray-200 bg-black rounded-full focus:outline-none"
								style="font-size: 16px;" />
						</form>
						<div
							v-if="suggestions.length > 0"
							id="search-results"
							role="listbox"
							class="absolute w-full bottom-full p-2 mb-3 bg-[#000000] rounded-2xl z-10">
							<ul>
								<li
									v-for="suggestion in suggestions"
									:key="suggestion.id"
									@click="selectSuggestion(suggestion)"
									@mousedown="preventBlur"
									role="option"
									:aria-selected="
										normalizeText(searchQuery) ===
										normalizeText(suggestion.name)
									"
									class="p-1 text-sm text-white hover:bg-black transition-all duration-200 active:scale-99 rounded-lg cursor-pointer flex items-center gap-3">
									<div
										v-if="imageLoading[suggestion.id]"
										class="w-10 h-10 rounded-md bg-gray-700 animate-pulse"
										aria-hidden="true"></div>
									<NuxtImg
										v-show="!imageLoading[suggestion.id]"
										:src="suggestion.image"
										:alt="suggestion.name"
										:title="suggestion.name"
										quality="50"
										class="rounded-md object-cover w-10 h-10"
										@contextmenu.prevent
										@load="setImageLoaded(suggestion.id)" />
									<span>{{ suggestion.name }}</span>
								</li>
							</ul>
						</div>
					</div>

					<button
						type="button"
						class="hidden md:block text-black md:text-sm px-3 md:px-5 py-2 bg-yellow hover:bg-yellow/85 active:scale-95 rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap"
						:class="{ hidden: isMobile && isInputFocused }"
						@click="scrollToTop"
						aria-label="Retour en haut de page">
						Retour en haut
					</button>
				</div>
			</div>
		</nav>
	</div>
</template>

<style scoped>
@media (max-width: 640px) {
	.z-50 {
		width: calc(100% - 2rem);
		max-width: 100%;
	}
}
</style>
