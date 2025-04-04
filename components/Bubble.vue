<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const searchQuery = ref("");
const suggestions = ref([]);
const isInputFocused = ref(false);
const preventBlurEvent = ref(false);
const isMobile = ref(false);

const checkScreenSize = () => {
	isMobile.value = window.innerWidth < 768;
};

const { data: allTables, error } = await useFetch("/api/allPaintings");

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
		.slice(0, 5); // Limiter à 5 suggestions
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
						class="hidden md:block text-black md:text-sm px-3 md:px-5 py-2 bg-yellow hover:bg-yellow/85 active:scale-95 rounded-full cursor-pointer transition-all duration-200 whitespace-nowrap"
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
