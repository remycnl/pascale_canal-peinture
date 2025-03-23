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
	if (screenWidth < 768) {
		// sm
		padding = 2 * 12;
	} else if (screenWidth < 1024) {
		// md
		padding = 2 * 20;
	} else if (screenWidth < 1280) {
		// lg
		padding = 2 * 28;
	} else {
		// xl+
		padding = 2 * 60;
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
			class="flex flex-col gap-y-1 text-2xl sm:text-3xl md:text-5xl lg:text-[80px] leading-tight lg:leading-[90px] text-left lg:w-2/3 lg:pb-40 lg:pt-20">
			<span
				class="z-20 group w-fit relative text-5xl sm:text-7xl md:text-8xl lg:text-[180px] leading-tight lg:leading-[180px] whitespace-nowrap font-apercuBold">
				Pascale Canal
				<span
					class="z-10 hidden md:block uppercase font-apercuMedium absolute bottom-2 lg:bottom-1 md:-rotate-10 lg:-rotate-12 -right-30 lg:-right-20 2xl:-right-35 text-base lg:text-xl md:py-1 lg:py-3 md:px-6 lg:px-10 bg-yellow rounded-md md:rounded-lg border border-black">
					Artiste peintre française
				</span>
			</span>
			<span
				class="z-10 uppercase -mt-2 font-apercuMedium w-fit text-xs sm:text-sm md:hidden py-1 sm:py-2 px-4 sm:px-6 bg-yellow rounded-md md:rounded-lg border border-black">
				Artiste peintre francaise
			</span>
			<span class="z-20 mt-5 md:mt-0"
				>Découvrez ma <span class="whitespace-nowrap">e-gallerie</span></span
			>
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
						class="absolute inset-0 flex items-center justify-center scale:100 lg:scale-50 group-hover:scale-100 lg:opacity-0 group-hover:opacity-100 transition-all duration-400">
						<div
							:style="{
								fontSize: `${cardSize * 0.3}px`,
							}"
							class="-rotate-45 mt-5 ml-5 flex items-center justify-center uppercase font-apercuBold text-white/50 origin-center">
							Vendu
						</div>
					</div>
				</div>
				<div
					class="relative flex justify-between items-end gap-x-4 py-3 px-6 group-hover:px-3 w-full text-white will-change-auto transition-all duration-500">
					<div
						class="absolute top-0 left-1/2 w-0 group-hover:w-1/2 will-change-auto h-0.5 bg-white transition-all duration-500"></div>
					<div
						class="absolute top-0 right-1/2 w-0 group-hover:w-1/2 will-change-auto h-0.5 bg-white transition-all duration-500"></div>
					<div class="flex justify-between gap-x-2 items-end w-full">
						<div class="flex items-start space-x-2 min-w-0 flex-1 mr-2">
							<NuxtImg
								src="/svg/arrow-white.svg"
								alt="right arrow"
								class="w-6 h-6 translate-x-1 origin-left will-change-auto group-hover:translate-x-0 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-400 flex-shrink-0" />
							<span
								class="text-base md:text-lg lg:text-xl font-apercuBold truncate -translate-x-8 will-change-auto group-hover:translate-x-0 transition-all duration-500 overflow-hidden text-ellipsis"
								>{{ painting.name }}</span
							>
						</div>
						<div
							class="text-sm md:text-base lg:text-lg whitespace-nowrap decoration-white flex-shrink-0">
							<span
								:class="
									painting.state === 'SOLD' ? 'line-through' : 'no-underline'
								">
								{{ painting.price + " €" }}
							</span>
							<span
								v-if="painting.state === 'SOLD'"
								class="ml-1 2xl:ml-2 hidden lg:inline">
								Vendu
							</span>
						</div>
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
