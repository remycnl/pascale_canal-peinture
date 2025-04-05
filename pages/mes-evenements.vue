<template>
	<div class="relative min-h-screen pt-10 md:pt-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full sm:w-3/4 2xl:w-2/3">
			Mes évènements à venir...
		</h1>

		<!-- Loading and error states -->
		<div v-if="isLoading" class="mt-10 flex justify-center">
			<div class="animate-pulse rounded-lg bg-gray-200 p-10 text-center">
				<p class="text-lg">Chargement des évènements...</p>
			</div>
		</div>

		<div v-else-if="error" class="mt-10 rounded-lg bg-red-100 p-6">
			<p class="text-red-700">
				Une erreur est survenue lors du chargement des évènements.
			</p>
			<button
				@click="refresh"
				class="mt-4 rounded-full bg-red-600 px-6 py-2 text-white hover:bg-red-700 transition">
				Réessayer
			</button>
		</div>

		<!-- Empty state -->
		<div v-else-if="activeEvents.length === 0" class="mt-20 text-center">
			<div class="p-10 bg-gray-50 rounded-xl">
				<h3 class="text-2xl font-apercuMediumbold mb-4">
					Aucun évènement disponible pour le moment
				</h3>
				<p class="text-gray-600">
					Revenez bientôt pour découvrir nos prochains évènements.
				</p>
			</div>
		</div>

		<!-- Events Grid -->
		<div
			v-else
			class="my-20 md:my-30 lg:my-50 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			<div
				v-for="event in activeEvents"
				:key="event.id"
				class="group rounded-xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col">
				<!-- Event Image -->
				<div class="relative overflow-hidden h-[200px]">
					<img
						:src="event.imageUrl || '/images/event-placeholder.jpg'"
						:alt="event.title"
						class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
					<div
						class="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-sm">
						{{ formatPrice(event.price) }}
					</div>
				</div>

				<!-- Event Content -->
				<div class="p-6 flex flex-col flex-grow">
					<div class="flex justify-between items-start mb-4">
						<h3 class="text-xl font-apercuBold">{{ event.title }}</h3>
						<span
							class="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-md">
							{{ formatDateRange(event.startDate, event.endDate) }}
						</span>
					</div>

					<p class="text-gray-600 line-clamp-3 mb-4">{{ event.description }}</p>

					<div class="mt-auto">
						<div class="flex items-center text-gray-500 mb-4">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5 mr-2"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2"
								stroke-linecap="round"
								stroke-linejoin="round">
								<path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
								<circle cx="12" cy="10" r="3"></circle>
							</svg>
							<span>{{ event.location }}</span>
						</div>

						<button
							@click="viewEventDetails(event.id)"
							class="w-full py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors">
							Voir les détails
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { useEvents } from "@/composables/useEvents";
import { computed } from "vue";

const { activeEvents, isLoading, error, refresh, getOneEvent } = useEvents();

const formatPrice = (price) => {
	if (!price) return "Gratuit";
	return `${price}€`;
};

const formatDateRange = (startDate, endDate) => {
	const start = new Date(startDate);
	const options = { day: "numeric", month: "short", year: "numeric" };

	if (!endDate) {
		return start.toLocaleDateString("fr-FR", options);
	}

	const end = new Date(endDate);

	// If same day, show only one date with time range
	if (start.toDateString() === end.toDateString()) {
		return `${start.toLocaleDateString(
			"fr-FR",
			options
		)} · ${start.getHours()}h${start
			.getMinutes()
			.toString()
			.padStart(2, "0")} - ${end.getHours()}h${end
			.getMinutes()
			.toString()
			.padStart(2, "0")}`;
	}

	// Different days
	return `${start.toLocaleDateString(
		"fr-FR",
		options
	)} - ${end.toLocaleDateString("fr-FR", options)}`;
};

const viewEventDetails = (id) => {
	navigateTo(`/evenement/${id}`);
};
</script>

<style scoped>
.line-clamp-3 {
	display: -webkit-box;
	-webkit-line-clamp: 3;
	-webkit-box-orient: vertical;
	overflow: hidden;
}
</style>
