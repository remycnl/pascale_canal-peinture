<script setup>
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
</script>

<template>
	<div class="relative min-h-screen">
		<section
			class="distortion transition-transform transform-gpu will-change-transform duration-75">
			<h1 class="flex flex-col text-[80px] leading-[90px] text-left w-2/3">
				<span
					class="text-[180px] leading-[180px] whitespace-nowrap font-apercuBold">
					Pascale Canal
				</span>
				<span>Artiste peintre française.</span>
				<!-- <span>Adoptez votre Aubrac !</span> -->
			</h1>

			<div
				class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-20">
				<NuxtLink
					v-for="painting in paintings"
					:to="`/${painting.slug}`"
					:key="painting.id"
					class="group bg-gradient-to-tr active:scale-95 from-black via-black to-grayDark rounded-2xl w-[450px] flex flex-col hover:rounded-none transition-all duration-500">
					<div
						class="relative w-full h-[450px] p-3 group-hover:p-0 transition-all duration-500">
						<NuxtImg
							:src="painting.image"
							:alt="painting.name"
							fit="cover"
							class="w-full h-full rounded-2sm group-hover:rounded-none transition-all duration-500" />
					</div>
					<div
						class="relative flex justify-between items-end py-3 px-6 group-hover:px-3 w-full text-white transition-all duration-500">
						<div
							class="absolute top-0 left-0 w-0 group-hover:w-full h-0.5 bg-white transition-all duration-500"></div>
						<div class="flex items-start space-x-2">
							<NuxtImg
								src="/svg/arrow.svg"
								alt="right arrow"
								class="w-6 h-6 translate-x-1 origin-left group-hover:translate-x-0 scale-50 group-hover:scale-100 opacity-0 group-hover:opacity-100 transition-all duration-300" />
							<span
								class="text-xl font-apercuBold -translate-x-8 group-hover:translate-x-0 transition-all duration-500"
								>{{ painting.name }}</span
							>
						</div>
						<span class="text-lg">{{ painting.price + " €" }}</span>
					</div>
					<!-- <p
						class="pointer-events-none text-xl text-black font-apercuBold opacity-0 translate-y-8 group-hover:translate-y-0 group-hover:opacity-100 origin-bottom-left transition-all duration-500 absolute -rotate-90 -left-3 bottom-0">
						Clique pour plus d'informations
					</p> -->
				</NuxtLink>
			</div>
		</section>
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
