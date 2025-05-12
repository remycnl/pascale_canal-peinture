<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from "vue";

const props = defineProps({
	currentPaintingId: {
		type: Number,
		required: true,
	},
});

const windowWidth = ref(1024);

if (import.meta.client) {
	windowWidth.value = window.innerWidth;
}

const SuggestionsLimit = computed(() => {
	if (windowWidth.value < 640) return 4; // Mobile
	if (windowWidth.value < 1024) return 6; // Tablette
	return 8; // Desktop
});

const fetchKey = computed(
	() => `suggestions-${props.currentPaintingId}-${SuggestionsLimit.value}`
);

const {
	data: paintings,
	pending,
	error,
	refresh,
} = useFetch("/api/paintings/forSalePaintings", {
	query: computed(() => ({
		limit: SuggestionsLimit.value,
		excludeId: props.currentPaintingId,
	})),
	key: fetchKey.value,
	server: true,
	fresh: true,
});

const handleResize = () => {
	if (import.meta.client) {
		windowWidth.value = window.innerWidth;
	}
};

watch([SuggestionsLimit, () => props.currentPaintingId], () => {
	refresh();
});

onMounted(() => {
	if (import.meta.client) {
		window.addEventListener("resize", handleResize);
	}
});

onUnmounted(() => {
	if (import.meta.client) {
		window.removeEventListener("resize", handleResize);
	}
});
</script>

<template>
	<section aria-labelledby="suggestions-heading">
		<div class="w-full flex items-center my-15 md:my-20 lg:my-30 2xl:my-40">
			<div
				class="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
				aria-hidden="true"></div>
			<div class="mx-2 sm:mx-4">
				<NuxtImg
					src="/img/logo.png"
					alt="Logo Pascale Canal"
					title="Logo Pascale Canal"
					format="webp"
					class="w-10 sm:w-15 md:w-20 h-auto" />
			</div>
			<div
				class="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"
				aria-hidden="true"></div>
		</div>
		<h2
			id="suggestions-heading"
			class="text-lg md:text-xl lg:text-3xl font-apercuBold text-black">
			Des œuvres qui
			<span class="lg:hidden"></span>
			pourraient vous séduire...
		</h2>

		<!-- Skeleton loader pendant le chargement -->
		<div
			v-if="pending"
			class="mt-3 md:mt-5 lg:mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8 animate-pulse"
			aria-busy="true"
			aria-label="Chargement des suggestions en cours">
			<div
				v-for="n in SuggestionsLimit"
				:key="n"
				class="bg-gray-200 aspect-square animate-pulse rounded-2xl"></div>
		</div>

		<!-- Erreur de chargement -->
		<div
			v-else-if="error"
			class="mt-3 md:mt-5 lg:mt-6 text-red-500 text-center p-4"
			role="alert">
			Impossible de charger les suggestions
		</div>

		<!-- Grille de suggestions -->
		<ul
			v-else
			class="mt-3 md:mt-5 lg:mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6 lg:gap-8"
			aria-labelledby="suggestions-heading">
			<li v-for="painting in paintings" :key="painting.id" class="list-none">
				<NuxtLink
					:to="`/${painting.slug}`"
					:aria-label="`Découvrir ${painting.name} - ${painting.price}€`"
					class="group relative block overflow-hidden rounded-xl md:rounded-2xl active:scale-98 transition-transform duration-200">
					<div class="aspect-square overflow-hidden">
						<NuxtImg
							:src="painting.image"
							:alt="painting.name"
							:title="`${painting.name} - ${painting.price}€`"
							quality="50"
							loading="lazy"
							@contextmenu.prevent
							class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:filter group-hover:grayscale" />
						<div
							class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
							aria-hidden="true"></div>
					</div>
					<div
						class="absolute bottom-0 left-0 right-0 p-2 sm:p-3 md:p-4 translate-y-0 group-hover:translate-y-0 transition-transform duration-300">
						<h3
							class="text-sm md:text-lg font-apercuMedium text-white drop-shadow-md">
							{{ painting.name }}
						</h3>
						<p
							class="text-xs md:text-sm text-gray-200 mt-0.5 md:mt-1 opacity-90">
							{{ painting.price }} €
						</p>
					</div>
				</NuxtLink>
			</li>
		</ul>
	</section>
</template>
