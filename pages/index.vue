<script setup>
const { data: paintings, error } = await useFetch("/api/paintings");

if (error.value) {
	console.error("Erreur lors de la récupération des peintures :", error.value);
}
</script>

<template>
	<div class="relative min-h-screen">
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
