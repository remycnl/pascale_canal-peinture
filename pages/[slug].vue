<template>
	<div class="relative min-h-screen">
		<div v-if="painting">
			<div class="text-end mb-10">
				<h1 class="text-[18rem] -mr-7 font-apercuBold tracking-wide text-black">
					{{ painting.name }}
				</h1>
				<p class="text-grayDark text-4xl -mt-20">
					<span class="text-lg">peint par</span>
					{{ painting.artist }}
				</p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-2 items-end gap-20">
				<div class="relative">
					<img
						:src="painting.image"
						:alt="painting.name"
						class="rounded-2xl w-auto max-h-[80vh] object-cover object-center" />
				</div>
				<div class="prose max-w-none text-grayDark">
					<h2 class="text-3xl font-bold text-black">Détails</h2>
					<ul class="mt-4 text-xl space-y-2">
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

			<div class="mt-40 text-end">
				<button
					class="bg-black text-white py-2 px-6 rounded-lg text-sm font-bold shadow-md hover:bg-grayDark transition duration-300">
					Acheter maintenant
				</button>
				<button
					class="ml-4 border border-black text-black py-2 px-6 rounded-lg text-sm font-bold hover:bg-black hover:text-white transition duration-300">
					Partager
				</button>
			</div>
		</div>

		<div v-else class="text-center py-12">
			<p class="text-xl">Peinture non trouvée</p>
		</div>
	</div>
</template>

<script setup>
const route = useRoute();

const { data: painting, error } = await useFetch(
	`/api/paintings/${route.params.slug}`
);

if (error.value) {
	console.error("Erreur lors de la récupération de la peinture :", error.value);
}

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

// Formater l'état
const formatState = (state) => {
	const states = {
		FOR_SALE: "En attente",
		SOLD: "Vendu",
	};
	return states[state] || state;
};

// Gestion des métadonnées
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
