<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from "vue";

const props = defineProps({
	currentPaintingId: {
		type: Number,
		required: true,
	},
});

const paintings = ref([]);
const pending = ref(true);
const error = ref(null);
const windowWidth = ref(0);

const SuggestionsLimit = computed(() => {
	if (windowWidth.value < 640) return 4; // Mobile
	if (windowWidth.value < 1024) return 6; // Tablette
	return 8; // Desktop
});

const fetchSuggestions = async () => {
	try {
		pending.value = true;
		const { data } = await useFetch("/api/paintings/forSalePaintings", {
			query: {
				limit: SuggestionsLimit.value,
				excludeId: props.currentPaintingId,
			},
			key: `suggestions-${props.currentPaintingId}-${SuggestionsLimit.value}`,
			server: true,
			fresh: true,
		});

		paintings.value = data.value || [];
	} catch (err) {
		error.value = err;
		console.error("Erreur de chargement des suggestions", err);
	} finally {
		pending.value = false;
	}
};

const handleResize = () => {
	windowWidth.value = window.innerWidth;
};

watch(SuggestionsLimit, () => {
	fetchSuggestions();
});

watch(
	() => props.currentPaintingId,
	() => {
		fetchSuggestions();
	}
);

onMounted(() => {
	windowWidth.value = window.innerWidth;
	fetchSuggestions();
	window.addEventListener("resize", handleResize);
});

onUnmounted(() => {
	window.removeEventListener("resize", handleResize);
});
</script>

<template>
	<div>
		<div class="w-full flex items-center my-15 md:my-20 lg:my-30 2xl:my-40">
			<div
				class="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
			<div class="mx-2 sm:mx-4">
				<NuxtImg
					src="/img/logo.png"
					alt="Logo"
					class="w-10 sm:w-15 md:w-20 h-auto" />
			</div>
			<div
				class="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
		</div>
		<h2 class="text-lg md:text-xl lg:text-3xl font-bold text-black">
			Des œuvres qui
			<div class="lg:hidden"></div>
			pourraient vous séduire...
		</h2>

		<!-- Skeleton loader pendant le chargement -->
		<div
			v-if="pending"
			class="mt-3 md:mt-5 lg:mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8 animate-pulse">
			<div
				v-for="n in SuggestionsLimit"
				:key="n"
				class="bg-gray-200 aspect-square animate-pulse rounded-2xl"></div>
		</div>

		<!-- Erreur de chargement -->
		<div
			v-else-if="error"
			class="mt-3 md:mt-5 lg:mt-6 text-red-500 text-center p-4">
			Impossible de charger les suggestions
		</div>

		<!-- Grille de suggestions -->
		<div
			v-else
			class="mt-3 md:mt-5 lg:mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8">
			<NuxtLink
				v-for="painting in paintings"
				:key="painting.id"
				:to="`/${painting.slug}`"
				class="group relative block overflow-hidden rounded-xl md:rounded-2xl active:scale-98 transition-transform duration-200">
				<div class="aspect-square overflow-hidden">
					<img
						:src="painting.image"
						:alt="painting.name"
						loading="lazy"
						class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:filter group-hover:grayscale" />
					<div
						class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
				</div>
				<div
					class="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
					<h3 class="text-sm md:text-lg font-medium text-white drop-shadow-md">
						{{ painting.name }}
					</h3>
					<p class="text-xs md:text-sm text-gray-200 mt-0.5 md:mt-1 opacity-90">
						{{ painting.price }} €
					</p>
				</div>
			</NuxtLink>
		</div>
	</div>
</template>
