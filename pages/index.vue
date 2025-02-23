<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";

const paintings = ref([]);
const page = ref(1);
const limit = 9;
const isLoading = ref(false);
const hasMore = ref(true);
const isImageLoaded = ref({});

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

onMounted(async () => {
	await loadPaintings();
	window.addEventListener("scroll", handleScroll);
});

onBeforeUnmount(() => {
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
			class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-28 mt-20">
			<NuxtLink
				v-for="painting in paintings"
				:to="`/${painting.slug}`"
				:key="painting.id"
				:class="getImageClass(painting.id)"
				class="z-10 group bg-gradient-to-tr active:scale-95 from-black via-black to-white rounded-2xl w-[450px] flex flex-col hover:rounded-none will-change-auto transition-all duration-500">
				<div
					class="overflow-hidden relative w-full h-[450px] p-3 group-hover:p-0 transition-all duration-500">
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
					class="relative flex justify-between items-end py-3 px-6 group-hover:px-3 w-full text-white will-change-auto transition-all duration-500">
					<div
						class="absolute top-0 left-0 w-0 group-hover:w-full will-change-auto h-0.5 bg-white transition-all duration-500"></div>
					<div class="flex items-start space-x-2">
						<NuxtImg
							src="/svg/arrow-white.svg"
							alt="right arrow"
							class="w-6 h-6 translate-x-1 origin-left will-change-auto group-hover:translate-x-0 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300" />
						<span
							class="text-xl font-apercuBold -translate-x-8 will-change-auto group-hover:translate-x-0 transition-all duration-500"
							>{{ painting.name }}</span
						>
					</div>
					<div class="text-lg decoration-white">
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
