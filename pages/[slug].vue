<template>
	<div class="container mx-auto px-4 py-8">
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
					<p><strong>Date:</strong> {{ painting.date }}</p>
					<p><strong>Prix:</strong> {{ formatPrice(painting.price) }} €</p>
					<p><strong>Type:</strong> {{ painting.type }}</p>
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

// Données statiques
const paintings = [
	{
		id: 1,
		name: "Léon",
		date: "06/02/2004",
		price: "1000",
		image: "/paintings/cow-1.jpeg",
		type: "cow",
		state: "pending",
		slug: "leon",
	},
	{
		id: 2,
		name: "Lisa",
		date: "01/01/1503",
		price: "1200000",
		image: "/paintings/cow-2.jpeg",
		type: "cow",
		state: "sold",
		slug: "lisa",
	},
	{
		id: 3,
		name: "Night",
		date: "06/06/1889",
		price: "950000",
		image: "/paintings/cow-1.jpeg",
		type: "cow",
		state: "pending",
		slug: "night",
	},
	{
		id: 4,
		name: "The Persistence",
		date: "01/01/1931",
		price: "750000",
		image: "/paintings/cow-2.jpeg",
		type: "cow",
		state: "sold",
		slug: "the-persistence",
	},
	{
		id: 5,
		name: "The Scream",
		date: "01/01/1893",
		price: "1500000",
		image: "/paintings/cow-1.jpeg",
		type: "cow",
		state: "pending",
		slug: "the-scream",
	},
	{
		id: 6,
		name: "Girl with a Pearl Earring",
		date: "01/01/1665",
		price: "670000",
		image: "/paintings/cow-2.jpeg",
		type: "cow",
		state: "sold",
		slug: "girl-with-a-pearl-earring",
	},
	{
		id: 7,
		name: "Guernica",
		date: "01/01/1937",
		price: "850000",
		image: "/paintings/cow-1.jpeg",
		type: "cow",
		state: "pending",
		slug: "guernica",
	},
	{
		id: 8,
		name: "The Birth of Venus",
		date: "01/01/1486",
		price: "980000",
		image: "/paintings/cow-2.jpeg",
		type: "cow",
		state: "sold",
		slug: "the-birth-of-venus",
	},
	{
		id: 9,
		name: "The Last Supper",
		date: "01/01/1498",
		price: "2000000",
		image: "/paintings/cow-1.jpeg",
		type: "cow",
		state: "pending",
		slug: "the-last-supper",
	},
	{
		id: 10,
		name: "American Gothic",
		date: "01/01/1930",
		price: "700000",
		image: "/paintings/cow-2.jpeg",
		type: "cow",
		state: "sold",
		slug: "american-gothic",
	},
	{
		id: 11,
		name: "The Kiss",
		date: "01/01/1908",
		price: "600000",
		image: "/paintings/cow-1.jpeg",
		type: "cow",
		state: "sold",
		slug: "the-kiss",
	},
	{
		id: 12,
		name: "Whistler's Mother",
		date: "01/01/1871",
		price: "400000",
		image: "/paintings/cow-2.jpeg",
		type: "cow",
		state: "pending",
		slug: "whistlers-mother",
	},
	{
		id: 13,
		name: "Nighthawks",
		date: "01/01/1942",
		price: "540000",
		image: "/paintings/cow-1.jpeg",
		type: "cow",
		state: "pending",
		slug: "nighthawks",
	},
	{
		id: 14,
		name: "Water Lilies",
		date: "01/01/1919",
		price: "350000",
		image: "/paintings/cow-2.jpeg",
		type: "cow",
		state: "pending",
		slug: "water-lilies",
	},
	{
		id: 15,
		name: "The Night Watch",
		date: "01/01/1642",
		price: "2500000",
		image: "/paintings/cow-1.jpeg",
		type: "cow",
		state: "sold",
		slug: "the-night-watch",
	},
	{
		id: 16,
		name: "Liberty Leading the People",
		date: "01/01/1830",
		price: "800000",
		image: "/paintings/cow-2.jpeg",
		type: "cow",
		state: "pending",
		slug: "liberty-leading-the-people",
	},
	{
		id: 17,
		name: "The Arnolfini Portrait",
		date: "01/01/1434",
		price: "560000",
		image: "/paintings/cow-1.jpeg",
		type: "cow",
		state: "pending",
		slug: "arnolfini-portrait",
	},
	{
		id: 18,
		name: "The Creation of Adam",
		date: "01/01/1512",
		price: "2100000",
		image: "/paintings/cow-2.jpeg",
		type: "cow",
		state: "pending",
		slug: "the-creation-of-adam",
	},
	{
		id: 19,
		name: "The Hay Wain",
		date: "01/01/1821",
		price: "370000",
		image: "/paintings/cow-1.jpeg",
		type: "cow",
		state: "pending",
		slug: "the-hay-wain",
	},
	{
		id: 20,
		name: "Impression, Sunrise",
		date: "01/01/1872",
		price: "300000",
		image: "/paintings/cow-2.jpeg",
		type: "cow",
		state: "pending",
		slug: "impression-sunrise",
	},
];

const painting = ref(null);

// Trouver la peinture correspondante au slug
painting.value = paintings.find((p) => p.slug === route.params.slug);

// Formater le prix
const formatPrice = (price) => {
	return new Intl.NumberFormat("fr-FR").format(price);
};

// Formater l'état
const formatState = (state) => {
	const states = {
		pending: "En attente",
		sold: "Vendu",
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
