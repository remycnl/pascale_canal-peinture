<template>
	<div class="relative min-h-screen">
		<div v-if="painting" class="max-w-4xl mx-auto">
			<h1 class="text-3xl font-bold mb-6">{{ painting.name }}</h1>
			<div class="aspect-w-16 aspect-h-9 mb-6">
				<img
					:src="painting.image"
					:alt="painting.name"
					class="rounded-lg object-cover w-full h-full" />
			</div>
			<div class="prose max-w-none">
				<div class="mt-4 space-y-2">
					<p><strong>Description:</strong> {{ painting.description }}</p>
					<p><strong>Date:</strong> {{ formatDate(painting.date) }}</p>
					<p><strong>Prix:</strong> {{ formatPrice(painting.price) }} €</p>
					<p><strong>Tag:</strong> {{ painting.tag }}</p>
					<p><strong>Artiste:</strong> {{ painting.artist }}</p>
					<p><strong>Dimensions:</strong> {{ painting.width }} cm x {{ painting.height }} cm</p>
					<p><strong>Type de peinture:</strong> {{ painting.paintingType }}</p>
					<p><strong>État:</strong> {{ formatState(painting.state) }}</p>
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

const { data: painting, error } = await useFetch(`/api/paintings/${route.params.slug}`);

if (error.value) {
  console.error('Erreur lors de la récupération de la peinture :', error.value);
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
