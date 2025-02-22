<template>
	<div class="relative min-h-screen pt-10">
		<div v-if="painting">
			<!-- <div class="absolute -top-180 -left-180 w-full h-auto opacity-90 blur-2xl">
				<NuxtImg src="/svg/blob-left.svg" alt="Blob left" />
			</div> -->
			<button
				@click="$router.back()"
				title="Go to the previous page"
				class="rotate-180 w-20 h-20 pointer-cursor hover:-translate-x-2 transition-transform duration-300">
				<NuxtImg src="/svg/arrow-black.svg" />
			</button>
			<div class="text-end mb-10">
				<h1
					class="text-[18rem] leading-[19rem] -mr-7 font-apercuBold tracking-wide text-black">
					{{ painting.name }}
				</h1>
				<p class="text-grayDark text-4xl">
					<span class="text-lg">peint par</span>
					{{ painting.artist }}
				</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 items-end gap-20">
				<div
					class="relative overflow-hidden rounded-2xl"
					@mousemove="handleMouseMove"
					@mouseleave="handleMouseLeave"
					@click="handleClick"
					:style="{
						cursor: isZoomed ? 'zoom-out' : 'zoom-in',
						aspectRatio: imageAspectRatio,
					}">
					<NuxtImg
						:src="painting.image"
						:alt="painting.name"
						fit="cover"
						format="webp"
						ref="imageRef"
						@load="handleImageLoad"
						:style="{
							transform: transform,
							transformOrigin: transformOrigin,
							transition: isZoomed ? 'none' : 'all 0.3s ease',
							opacity: imageLoaded ? 1 : 0,
						}"
						class="rounded-2xl w-full h-full max-h-[80vh] object-center will-change-transform" />
				</div>
				<div class="relative prose max-w-none text-grayDark">
					<div class="absolute -top-20 right-0 text-end will-change-scroll">
						<button
							v-if="painting.state === 'SOLD'"
							class="bg-black text-white py-2 px-6 rounded-lg text-sm font-bold shadow-md hover:bg-grayDark transition duration-300">
							Demander une réédition
						</button>
						<button
							v-else
							class="bg-black text-white py-2 px-6 rounded-lg text-sm font-bold shadow-md hover:bg-grayDark transition duration-300">
							Acheter maintenant
						</button>
						<button
							class="ml-4 border border-black text-black py-2 px-6 rounded-lg text-sm font-bold hover:bg-black hover:text-white transition duration-300">
							Partager
						</button>
					</div>
					<h2 class="text-3xl font-bold text-black">Détails</h2>
					<ul class="mt-4 text-xl space-y-2">
						<li v-if="painting.state === 'SOLD'">
							<span class="font-apercuLight text-base text-[#B60071]">
								Ce tableau a été vendu. Il est possible de demander une
								réédition, mais chaque création étant unique, la nouvelle
								version ne sera pas exactement identique.
							</span>
						</li>
						<li>
							<span class="font-apercuBold">Prix:</span>
							{{ formatPrice(painting.price) }} €
						</li>
						<li>
							<span class="font-apercuBold">Dimensions:</span>
							{{ painting.width }} cm x {{ painting.height }} cm
						</li>
						<li>
							<span class="font-apercuBold">Type de peinture:</span>
							{{ painting.paintingType }}
						</li>
						<li>
							<span class="font-apercuBold">Date:</span>
							{{ formatDate(painting.date) }}
						</li>
					</ul>
				</div>
				<div></div>

				<div class="prose max-w-none text-grayDark">
					<h2 class="text-3xl font-bold text-black">Son histoire</h2>
					<p class="mt-4 text-xl leading-relaxed">
						{{ painting.description }}
					</p>
				</div>
			</div>
		</div>

		<div v-else class="text-center py-12">
			<p class="text-xl">Peinture non trouvée</p>
		</div>
	</div>
</template>

<script setup>
const route = useRoute();

const imageRef = ref(null);
const isZoomed = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const transformOrigin = ref("center");
const zoomLevel = 2.5;
const imageLoaded = ref(false);
const imageAspectRatio = ref("1/1");

const { data: painting, error } = await useFetch(
	`/api/paintings/${route.params.slug}`
);

if (error.value) {
	console.error("Erreur lors de la récupération de la peinture :", error.value);
}

const handleImageLoad = (event) => {
	const img = event.target;
	imageAspectRatio.value = "1/1";
	imageLoaded.value = true;
};

//formater la date
const formatDate = (date) => {
	const options = {
		year: "numeric",
		month: "long",
		day: "numeric",
	};
	return new Date(date).toLocaleDateString("fr-FR", options);
};

// Formater le prix
const formatPrice = (price) => {
	return new Intl.NumberFormat("fr-FR").format(price);
};

const transform = computed(() => {
	return isZoomed.value ? `scale(${zoomLevel})` : "scale(1)";
});

const calculatePosition = (e) => {
	const rect = e.currentTarget.getBoundingClientRect();
	const x = ((e.clientX - rect.left) / rect.width) * 100;
	const y = ((e.clientY - rect.top) / rect.height) * 100;
	return { x, y };
};

const handleClick = (e) => {
	const pos = calculatePosition(e);
	transformOrigin.value = `${pos.x}% ${pos.y}%`;
	isZoomed.value = !isZoomed.value;
};

const handleMouseMove = (e) => {
	if (!isZoomed.value) return;
	const pos = calculatePosition(e);
	mousePosition.value = pos;
	transformOrigin.value = `${pos.x}% ${pos.y}%`;
};

const handleMouseLeave = () => {
	if (isZoomed.value) {
		isZoomed.value = false;
	}
};

useHead(() => ({
	title: painting.value
		? `${painting.value.name} | Galerie`
		: "Page non trouvée",
	meta: [
		{
			name: "description",
			content: painting.value
				? `${painting.value.name} - ${formatPrice(painting.value.price)}€`
				: "Page de peinture non trouvée",
		},
	],
}));
</script>
