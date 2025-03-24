<script setup>
const route = useRoute();
const imageRef = ref(null);
const isZoomed = ref(false);
const mousePosition = ref({ x: 50, y: 50 });
const transformOrigin = ref("center");
const zoomLevel = 2.5;
const imageLoaded = ref(false);
const touchStart = ref({ x: 0, y: 0 });
const touchMove = ref({ x: 0, y: 0 });

const { data: painting, error } = await useFetch(
	`/api/paintings/${route.params.slug}`
);

if (error.value) {
	console.error("Erreur lors de la récupération de la peinture :", error.value);
}

const handleImageLoad = () => {
	imageLoaded.value = true;
};

const formatDate = (date) => {
	return new Date(date).toLocaleDateString("fr-FR", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

const formatPrice = (price) => {
	return new Intl.NumberFormat("fr-FR").format(price);
};

const transform = computed(() => {
	return isZoomed.value ? `scale(${zoomLevel})` : "scale(1)";
});

const calculatePosition = (x, y, rect) => {
	const posX = ((x - rect.left) / rect.width) * 100;
	const posY = ((y - rect.top) / rect.height) * 100;
	return { x: posX, y: posY };
};

const handleClick = (e) => {
	const rect = e.currentTarget.getBoundingClientRect();
	const pos = calculatePosition(e.clientX, e.clientY, rect);
	transformOrigin.value = `${pos.x}% ${pos.y}%`;
	isZoomed.value = !isZoomed.value;
};

const handleMouseMove = (e) => {
	if (!isZoomed.value) return;
	const rect = e.currentTarget.getBoundingClientRect();
	const pos = calculatePosition(e.clientX, e.clientY, rect);
	mousePosition.value = pos;
	transformOrigin.value = `${pos.x}% ${pos.y}%`;
};

const handleTouchStart = (e) => {
	if (!isZoomed.value || e.touches.length !== 1) return;
	const touch = e.touches[0];
	const rect = imageRef.value.getBoundingClientRect();
	touchStart.value = calculatePosition(touch.clientX, touch.clientY, rect);
	touchMove.value = { ...touchStart.value };
};

const handleTouchMove = (e) => {
	if (!isZoomed.value || e.touches.length !== 1) return;
	e.preventDefault(); // Empêche le scroll de la page pendant le zoom
	const touch = e.touches[0];
	const rect = imageRef.value.getBoundingClientRect();
	touchMove.value = calculatePosition(touch.clientX, touch.clientY, rect);

	const deltaX = touchMove.value.x - touchStart.value.x;
	const deltaY = touchMove.value.y - touchStart.value.y;

	transformOrigin.value = `${50 - deltaX}% ${50 - deltaY}%`;
};

const handleTouchEnd = () => {
	touchStart.value = { x: 50, y: 50 };
	touchMove.value = { x: 50, y: 50 };
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


<template>
	<div class="relative min-h-screen pt-10">
		<div v-if="painting">
			<button
				@click="$router.back()"
				title="Go to the previous page"
				class="rotate-180 active:scale-95 w-10 h-10 md:w-15 md:h-15 lg:w-20 lg:h-20 pointer-cursor hover:-translate-x-2 transition-transform duration-200">
				<NuxtImg src="/svg/arrow-black.svg" />
			</button>
			<div class="text-end mb-10">
				<h1
					class="text-[clamp(3rem,15vw,18rem)] leading-[clamp(3rem,16vw,19rem)] font-apercuBold tracking-wide text-black">
					{{ painting.name }}
				</h1>
				<p class="text-grayDark text-xl md:text-2xl lg:text-4xl">
					<span class="text-xs md:text-sm lg:text-lg">peint par</span>
					{{ painting.artist }}
				</p>
			</div>
			<div class="grid grid-cols-1 md:grid-cols-2 items-end gap-10 md:gap-15 lg:gap-20">
				<div
					class="relative overflow-hidden rounded-2xl aspect-square"
					:class="{ 'animate-pulse bg-gray-200': !imageLoaded }"
					@mousemove="handleMouseMove"
					@mouseleave="handleMouseLeave"
					@click="handleClick"
					:style="{
						cursor: isZoomed ? 'zoom-out' : 'zoom-in',
					}">
					<NuxtImg
						:src="painting.image"
						:alt="painting.name"
						fit="cover"
						format="webp"
						quality="100"
						ref="imageRef"
						@load="handleImageLoad"
						:style="{
							transform: transform,
							transformOrigin: transformOrigin,
							transition: isZoomed ? 'none' : 'all 0.3s ease',
							opacity: imageLoaded ? 1 : 0,
						}"
						class="rounded-2xl w-full h-full object-center will-change-transform" />
				</div>
				<div class="relative prose max-w-none text-grayDark">
					<div
						class="lg:absolute -mt-7 lg:mt-0 -top-20 right-0 text-end will-change-scroll flex flex-col lg:flex-row gap-4">
						<button
							v-if="painting.state === 'SOLD'"
							class="bg-black active:scale-95 text-white py-2 px-6 rounded-lg text-sm font-bold shadow-md hover:bg-grayDark transition duration-200">
							Demander une réédition
						</button>
						<button
							v-else
							class="bg-black active:scale-98 md:active:scale-95 text-white py-2 px-6 rounded-lg text-sm font-bold shadow-md hover:bg-grayDark transition duration-200">
							Acheter
						</button>
						<ShareButton
							:title="`Découvre '${painting.name}' peint par ${painting.artist}`"
							:description="painting.description"
							position="bottom-right" />
					</div>
					<h2
						class="text-lg md:text-xl mt-10 lg:mt-0 lg:text-3xl font-bold text-black">
						Détails
					</h2>
					<ul class="mt-4 text-sm md:text-base lg:text-xl space-y-2">
						<li v-if="painting.state === 'SOLD'">
							<span
								class="font-apercuLight text-xs md:text-sm lg:text-base text-[#B60071]">
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
				<div class="hidden lg:block"></div>

				<div class="prose max-w-none text-grayDark md:col-span-2 2xl:col-span-1">
					<h2 class="text-lg md:text-xl lg:text-3xl font-bold text-black">
						Son histoire
					</h2>
					<p class="mt-4 text-sm md:text-lg lg:text-xl leading-relaxed">
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
