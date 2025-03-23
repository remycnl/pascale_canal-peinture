<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const paintings = ref([]);
const page = ref(1);
const limit = 9;
const isLoading = ref(false);
const hasMore = ref(true);
const isImageLoaded = ref({});
const cardSize = ref(0);

const loadPaintings = async () => {
	if (isLoading.value || !hasMore.value) return;
	isLoading.value = true;

	try {
		const data = await $fetch(
			`/api/paintings?page=${page.value}&limit=${limit}`
		);
		if (Array.isArray(data)) {
			if (data.length < limit) {
				hasMore.value = false;
			}
			paintings.value = [...paintings.value, ...data];
		} else {
			console.error("Réponse inattendue de l'API :", data);
		}
	} catch (err) {
		console.error("Erreur lors du chargement des peintures :", err);
	} finally {
		isLoading.value = false;
		page.value++;
	}
};

const handleImageLoad = (paintingId) => {
	isImageLoaded.value[paintingId] = true;
};

const getImageClass = (paintingId) => {
	return isImageLoaded.value[paintingId] ? "opacity-100" : "opacity-0";
};

const handleScroll = () => {
	const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

	if (scrollTop + clientHeight >= scrollHeight - 200) {
		loadPaintings();
	}
};

const calculateCardSize = () => {
	const screenWidth = document.documentElement.clientWidth;
	const containerWidth = Math.min(screenWidth, 2560);

	let columns;
	if (screenWidth < 768) {
		columns = 1; // Mobile
	} else if (screenWidth < 1024) {
		columns = 2; // Tablette
	} else {
		columns = 3; // Grand écran
	}

	let padding;
	if (screenWidth < 640) {
		// Base
		padding = 2 * 8; // px-2
	} else if (screenWidth < 768) {
		// sm
		padding = 2 * 12; // px-3
	} else if (screenWidth < 1024) {
		// md
		padding = 2 * 20; // px-5
	} else if (screenWidth < 1280) {
		// lg
		padding = 2 * 28; // px-7
	} else {
		// xl+
		padding = 2 * 60; // px-15
	}

	let gap;
	if (screenWidth < 768) {
		// mobile
		gap = 20;
	} else if (screenWidth < 1024) {
		// md
		gap = 80;
	} else {
		// lg and above
		gap = 120;
	}

	cardSize.value = Math.floor(
		(containerWidth - padding - gap * (columns - 1)) / columns
	);
};

onMounted(async () => {
	calculateCardSize();
	window.addEventListener("resize", calculateCardSize);
	await loadPaintings();
	window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
	window.removeEventListener("resize", calculateCardSize);
	window.removeEventListener("scroll", handleScroll);
});

// fait une fonction qui défini dynamiquement la taille d une card cardSize (carré)en px en fonction de la taille de l'écran et en prenant en compte le nombre de card par ligne possible et la taille des gap (120px)
</script>

<template>
	<div class="relative min-h-screen">
		<div
			class="select-none pointer-events-none absolute -top-180 -right-180 w-full h-auto opacity-90 blur-2xl">
			<NuxtImg src="/svg/blob-right.svg" alt="Blob right" />
		</div>
		<div
			class="select-none pointer-events-none absolute top-[20vh] -left-200 w-full h-auto opacity-90 blur-2xl">
			<NuxtImg src="/svg/blob-left.svg" alt="Blob left" />
		</div>
		<h1
			class="flex flex-col text-[80px] leading-[90px] text-left w-2/3 pb-40 pt-20">
			<span
				class="z-20 group relative text-[180px] leading-[180px] whitespace-nowrap font-apercuBold">
				Pascale Canal
				<span
					class="z-10 uppercase font-apercuMedium absolute bottom-0 -rotate-10 -right-60 text-2xl py-3 px-10 bg-yellow rounded-lg border border-black">
					Artiste peintre française
				</span>
			</span>
			<span class="z-20">Découvrez ma e-gallerie</span>
		</h1>

		<div
			class="relative flex flex-wrap justify-between items-center gap-5 md:gap-20 lg:gap-30 mt-20">
			<NuxtLink
				v-for="painting in paintings"
				:to="`/${painting.slug}`"
				:key="painting.id"
				:class="[getImageClass(painting.id)]"
				:style="`width: ${cardSize}px`"
				class="z-10 group bg-gradient-to-tr active:scale-95 from-black via-black to-white rounded-2xl flex flex-col hover:rounded-none will-change-auto transition-all duration-500">
				<div
					:style="`height: ${cardSize}px`"
					class="overflow-hidden relative w-full p-3 group-hover:p-0 transition-all duration-500">
					<NuxtImg
						:src="painting.image"
						:alt="painting.name"
						fit="cover"
						format="webp"
						loading="lazy"
						quality="50"
						@load="handleImageLoad(painting.id)"
						class="w-full h-full rounded-2sm group-hover:rounded-none will-change-auto transition-all duration-500" />
					<div
						v-if="painting.state === 'SOLD'"
						class="absolute top-1/4 left-0 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-400 uppercase font-apercuBold text-[9rem] text-white/50 origin-center -rotate-45">
						Vendu
					</div>
				</div>
				<div
					class="relative flex justify-between items-end gap-x-2 py-3 px-6 group-hover:px-3 w-full text-white will-change-auto transition-all duration-500">
					<div
						class="absolute top-0 left-1/2 w-0 group-hover:w-1/2 will-change-auto h-0.5 bg-white transition-all duration-500"></div>
					<div
						class="absolute top-0 right-1/2 w-0 group-hover:w-1/2 will-change-auto h-0.5 bg-white transition-all duration-500"></div>
					<div class="flex items-start space-x-2">
						<NuxtImg
							src="/svg/arrow-white.svg"
							alt="right arrow"
							class="w-6 h-6 translate-x-1 origin-left will-change-auto group-hover:translate-x-0 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-400" />
						<span
							class="text-xl font-apercuBold truncate -translate-x-8 will-change-auto group-hover:translate-x-0 transition-all duration-500"
							>{{ painting.name }}</span
						>
					</div>
					<div class="text-lg whitespace-nowrap decoration-white">
						<span
							:class="
								painting.state === 'SOLD' ? 'line-through' : 'no-underline'
							">
							{{ painting.price + " €" }}
						</span>
						<span v-if="painting.state === 'SOLD'" class="ml-2"> Vendu </span>
					</div>
				</div>
			</NuxtLink>
		</div>

		<div v-if="isLoading" class="text-center text-[180rem] mt-28">
			Chargement...
		</div>

		<div v-if="!hasMore" class="text-center mt-28">
			Toutes les peintures ont été chargées.
		</div>
	</div>
</template>

<style scoped>
.bubble-enter-active,
.bubble-leave-active {
	transition: all 0.3s ease;
}

.bubble-enter-from,
.bubble-leave-to {
	opacity: 0;
	transform: translate(-50%, 1rem);
}

.bubble-enter-to,
.bubble-leave-from {
	opacity: 1;
	transform: translate(-50%, 0);
}
</style>
