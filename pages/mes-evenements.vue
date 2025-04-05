<script setup>
import { useEvents } from "@/composables/useEvents";
import { ref, computed, watch, onMounted, nextTick } from "vue";

// Import the composable
const {
	upcomingEvents,
	pastEvents,
	refresh,
	formatDate,
	upcomingEventsLoading,
	pastEventsLoading,
	error,
	fetchUpcomingEvents,
	fetchPastEvents,
} = useEvents();

// Active tab state
const activeTab = ref("upcoming");

// Refs pour les boutons
const upcomingBtn = ref(null);
const pastBtn = ref(null);

// État pour l'indicateur
const indicatorWidth = ref(0);
const indicatorLeft = ref(0);

// Fonction pour mettre à jour la position et la largeur de l'indicateur
const updateIndicatorPosition = () => {
	if (activeTab.value === "upcoming" && upcomingBtn.value) {
		indicatorWidth.value = upcomingBtn.value.offsetWidth;
		indicatorLeft.value = upcomingBtn.value.offsetLeft;
	} else if (activeTab.value === "past" && pastBtn.value) {
		indicatorWidth.value = pastBtn.value.offsetWidth;
		indicatorLeft.value = pastBtn.value.offsetLeft;
	}
};

// Computed property to get the events based on active tab
const displayedEvents = computed(() => {
	return activeTab.value === "upcoming"
		? upcomingEvents.value
		: pastEvents.value;
});

// Computed property to determine loading state based on active tab
const isLoading = computed(() => {
	return activeTab.value === "upcoming"
		? upcomingEventsLoading.value
		: pastEventsLoading.value;
});

// Function to view event details
const viewEventDetails = (eventId) => {
	// Navigate to event details page
	navigateTo(`/events/${eventId}`);
};

// Format price
const formatPrice = (price) => {
	if (!price) return "Gratuit";
	return `${price} €`;
};

// Format date range
const formatDateRange = (startDate, endDate, showStartTime, showEndTime) => {
	if (!startDate) return "";

	const start = formatDate(startDate, showStartTime);
	if (!endDate || startDate === endDate) return start;

	const end = formatDate(endDate, showEndTime);
	return `${start} - ${end}`;
};

// Load events based on active tab
const loadEvents = async () => {
	if (activeTab.value === "upcoming") {
		await fetchUpcomingEvents();
	} else {
		await fetchPastEvents();
	}
};

// Watch for tab changes to load appropriate events and update indicator
watch(activeTab, () => {
	loadEvents();
	nextTick(() => {
		updateIndicatorPosition();
	});
});

// Initial data load and setup
onMounted(() => {
	loadEvents();
	nextTick(() => {
		updateIndicatorPosition();
		window.addEventListener("resize", updateIndicatorPosition);
	});
});

// Cleanup on component unmount
onUnmounted(() => {
	window.removeEventListener("resize", updateIndicatorPosition);
});

// Skeleton array for loading state
const skeletonItems = computed(() => {
	// If there are events in the current tab, use that count for the skeletons
	// Otherwise, default to 3 skeletons
	const count =
		activeTab.value === "upcoming"
			? upcomingEvents.value?.length || 3
			: pastEvents.value?.length || 3;

	return Array(count).fill({});
});
</script>

<template>
	<div class="relative min-h-screen pt-10 md:pt-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full sm:w-3/4 2xl:w-2/3">
			Mes évènements
		</h1>

		<div class="mt-10 md:mt-20 lg:mt-30">
			<!-- Event tabs -->
			<div class="flex justify-end mb-12">
				<div class="relative inline-flex bg-black rounded-full shadow-md p-1.5">
					<!-- Sliding indicator -->
					<div
						class="absolute shadow-sm bg-white rounded-full transition-all duration-300 ease-in-out z-0"
						:style="{
							left: indicatorLeft + 'px',
							width: indicatorWidth + 'px',
							top: '6px',
							bottom: '6px',
						}"></div>
					<!-- Buttons -->
					<button
						ref="upcomingBtn"
						@click="activeTab = 'upcoming'"
						class="relative z-10 rounded-full px-6 py-3 text-base md:text-lg font-apercuMedium transition-all duration-200"
						:class="
							activeTab === 'upcoming'
								? 'text-black'
								: 'text-white hover:text-gray-200 active:scale-95'
						"
						aria-label="Voir les événements à venir">
						À venir
					</button>
					<button
						ref="pastBtn"
						@click="activeTab = 'past'"
						class="relative z-10 rounded-full px-6 py-3 text-base md:text-lg font-apercuMedium transition-all duration-200"
						:class="
							activeTab === 'past'
								? 'text-black'
								: 'text-white hover:text-gray-200 active:scale-95'
						"
						aria-label="Voir les événements passés">
						Passés
					</button>
				</div>
			</div>

			<!-- Error state -->
			<div
				v-if="error"
				class="max-w-md mx-auto mt-8 mb-12 rounded-xl bg-red-50 p-6 border border-red-200 shadow-sm">
				<div class="flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-8 w-8 text-red-500 mr-4"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
					<p class="text-red-700 font-medium">
						Une erreur est survenue lors du chargement des évènements.
					</p>
				</div>
				<button
					@click="refresh"
					class="mt-4 w-full rounded-full bg-red-600 px-6 py-3 text-white hover:bg-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
					Réessayer
				</button>
			</div>

			<!-- Loading skeletons -->
			<div
				v-else-if="isLoading"
				class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				<div
					v-for="(_, index) in skeletonItems"
					:key="index"
					class="flex flex-col bg-white rounded-2xl shadow-md overflow-hidden animate-pulse">
					<div class="h-52 bg-gray-200"></div>
					<div class="p-6 flex-1">
						<div class="flex justify-between items-start mb-6">
							<div class="h-7 bg-gray-200 rounded w-3/4"></div>
							<div class="h-5 bg-gray-200 rounded w-1/4"></div>
						</div>
						<div class="h-4 bg-gray-200 rounded mb-2"></div>
						<div class="h-4 bg-gray-200 rounded mb-2 w-3/4"></div>
						<div class="h-4 bg-gray-200 rounded mb-4 w-1/2"></div>
						<div class="flex items-center mb-6">
							<div class="h-5 w-5 bg-gray-200 rounded-full mr-2"></div>
							<div class="h-4 bg-gray-200 rounded w-1/3"></div>
						</div>
						<div class="h-12 bg-gray-200 rounded-lg"></div>
					</div>
				</div>
			</div>

			<!-- Empty state -->

			<div
				v-else-if="displayedEvents.length === 0"
				class="mt-12 p-10 bg-white rounded-2xl shadow-sm border border-gray-100">
				<img
					:src="
						activeTab === 'upcoming'
							? '/images/calendar-empty.svg'
							: '/images/history-empty.svg'
					"
					alt="Aucun événement"
					class="w-32 h-32 mx-auto mb-6 opacity-80" />
				<h3 class="text-2xl font-apercuBold mb-4">
					{{
						activeTab === "upcoming"
							? "Aucun évènement à venir"
							: "Aucun évènement passé"
					}}
				</h3>
				<p class="text-gray-600 mb-6">
					{{
						activeTab === "upcoming"
							? "Revenez bientôt pour découvrir nos prochains évènements."
							: "Consultez notre page événements à venir."
					}}
				</p>
				<button
					v-if="activeTab === 'past'"
					@click="activeTab = 'upcoming'"
					class="inline-flex items-center px-5 py-3 rounded-full bg-primary text-white hover:bg-primary-dark transition focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 mr-2"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
							clip-rule="evenodd" />
					</svg>
					Voir les évènements à venir
				</button>
			</div>

			<!-- Events display -->
			<div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				<div
					v-for="event in displayedEvents"
					:key="event.id"
					class="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden h-full transform hover:-translate-y-1"
					tabindex="0"
					@click="viewEventDetails(event.id)"
					@keydown.enter="viewEventDetails(event.id)"
					role="button"
					:aria-label="`Voir les détails de l'événement: ${event.title}`">
					<!-- Event Image -->
					<div class="relative h-52 overflow-hidden">
						<img
							:src="event.imageUrl || '/images/event-placeholder.jpg'"
							:alt="event.title"
							class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
							loading="lazy" />

						<!-- Price tag -->
						<div
							class="absolute top-4 right-4 bg-white px-4 py-2 rounded-full text-sm font-apercuMedium shadow-md">
							{{ formatPrice(event.price) }}
						</div>

						<!-- Past event overlay -->
						<div
							v-if="activeTab === 'past'"
							class="absolute inset-0 bg-black/50 flex items-center justify-center">
							<span
								class="bg-black/70 text-white px-5 py-2 rounded-full font-apercuMedium">
								Terminé
							</span>
						</div>

						<!-- Date badge -->
						<div
							class="absolute left-4 top-4 bg-white rounded-xl overflow-hidden shadow-md">
							<div
								class="bg-primary px-3 py-1 text-center text-white text-xs font-apercuMedium">
								{{
									new Date(event.startDate)
										.toLocaleString("fr-FR", { month: "short" })
										.toUpperCase()
								}}
							</div>
							<div
								class="px-3 py-1 text-center text-gray-800 font-apercuBold text-lg leading-none">
								{{ new Date(event.startDate).getDate() }}
							</div>
						</div>
					</div>

					<!-- Event Content -->
					<div class="p-6 flex-1 flex flex-col">
						<h3
							class="text-xl font-apercuBold mb-2 group-hover:text-primary transition-colors">
							{{ event.title }}
						</h3>

						<div class="flex items-center text-gray-500 mb-4 text-sm">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-4 w-4 mr-1"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
									clip-rule="evenodd" />
							</svg>
							<span>{{
								formatDateRange(
									event.startDate,
									event.endDate,
									event.showStartTime,
									event.showEndTime
								)
							}}</span>
						</div>

						<p class="text-gray-600 line-clamp-2 mb-4 text-sm">
							{{ event.description }}
						</p>

						<div class="mt-auto">
							<div class="flex items-center text-gray-500 mb-4 text-sm">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="h-4 w-4 mr-1"
									viewBox="0 0 20 20"
									fill="currentColor">
									<path
										fill-rule="evenodd"
										d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
										clip-rule="evenodd" />
								</svg>
								<span>{{ event.location }}</span>
							</div>

							<div class="flex justify-between items-center">
								<button
									class="w-full py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
									Voir les détails
									<span class="sr-only">de {{ event.title }}</span>
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
