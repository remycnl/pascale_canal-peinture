<script setup>
import { useEvents } from "@/composables/useEvents";
import { ref, computed, watch, onMounted, nextTick } from "vue";
import { useSchemaOrg } from "#imports";

const config = useRuntimeConfig();

const baseUrl = config.public.siteUrl;
const siteName = config.public.siteName;

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

const activeTab = ref("upcoming");

const upcomingBtn = ref(null);
const pastBtn = ref(null);

const indicatorWidth = ref(0);
const indicatorLeft = ref(0);

const updateIndicatorPosition = () => {
	if (activeTab.value === "upcoming" && upcomingBtn.value) {
		indicatorWidth.value = upcomingBtn.value.offsetWidth;
		indicatorLeft.value = upcomingBtn.value.offsetLeft;
	} else if (activeTab.value === "past" && pastBtn.value) {
		indicatorWidth.value = pastBtn.value.offsetWidth;
		indicatorLeft.value = pastBtn.value.offsetLeft;
	}
};

const displayedEvents = computed(() => {
	return activeTab.value === "upcoming"
		? upcomingEvents.value
		: pastEvents.value;
});

const isLoading = computed(() => {
	return activeTab.value === "upcoming"
		? upcomingEventsLoading.value
		: pastEventsLoading.value;
});

const formatPrice = (price) => {
	if (!price) return "Gratuit";
	return `${price} €`;
};

const formatDateRange = (startDate, endDate, showStartTime, showEndTime) => {
	if (!startDate) return "";

	const start = formatDate(startDate, showStartTime);
	if (!endDate || startDate === endDate) return start;

	const end = formatDate(endDate, showEndTime);
	return `${start} - ${end}`;
};

const loadEvents = async () => {
	if (activeTab.value === "upcoming") {
		await fetchUpcomingEvents();
	} else {
		await fetchPastEvents();
	}
};

watch(activeTab, () => {
	loadEvents();
	nextTick(() => {
		updateIndicatorPosition();
	});
});

onMounted(() => {
	loadEvents();
	nextTick(() => {
		updateIndicatorPosition();
		window.addEventListener("resize", updateIndicatorPosition);
	});
});

onUnmounted(() => {
	window.removeEventListener("resize", updateIndicatorPosition);
});

const skeletonItems = computed(() => {
	const count =
		activeTab.value === "upcoming"
			? upcomingEvents.value?.length || 3
			: pastEvents.value?.length || 3;

	return Array(count).fill({});
});

useSeoMeta({
	title: () => `Mes évènements | ${siteName}`,
	description: () =>
		`Découvrez les prochains évènements de Pascale Canal et les expositions passées. Retrouvez toutes les dates, lieux et informations sur les expositions et ateliers à venir.`,
	ogTitle: () => `Mes évènements | ${siteName}`,
	ogDescription: () =>
		`Découvrez les prochains évènements de Pascale Canal et les expositions passées. Retrouvez toutes les dates, lieux et informations sur les expositions et ateliers à venir.`,
	ogUrl: () => `${baseUrl}/mes-evenements`,
	twitterTitle: () => `Mes évènements | ${siteName}`,
	twitterDescription: () =>
		`Découvrez les prochains évènements de Pascale Canal et les expositions passées. Retrouvez toutes les dates, lieux et informations sur les expositions et ateliers à venir.`,
	twitterUrl: () => `${baseUrl}/mes-evenements`,
});

useSchemaOrg([
	defineBreadcrumb({
		itemListElement: [
			{
				name: "Accueil",
				item: "/",
			},
			{
				name: "Mes évènements",
				item: "/mes-evenements",
			},
		],
	}),
]);
</script>

<template>
	<div class="relative min-h-screen pt-10 md:pt-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full sm:w-3/4 2xl:w-2/3">
			Mes évènements
		</h1>

		<div class="mt-10 md:mt-20 lg:mt-30">
			<!-- Event tabs -->
			<div class="flex justify-end mb-8 md:mb-12">
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
			<Transition name="fade" mode="out-in">
				<div
					v-if="error"
					class="max-w-md text-sm md:text-base mx-auto mt-8 mb-12 rounded-xl bg-red-50 p-6 border border-red-200 shadow-sm">
					<div class="flex items-start">
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
						<p class="text-red-700 font-apercuMedium">
							Une erreur est survenue lors du chargement des évènements.
						</p>
					</div>
					<div class="flex justify-end">
						<button
							@click="refresh"
							class="mt-4 w-fit rounded-full bg-red-600 px-6 py-1 text-white hover:bg-red-700 transition-all duation-200 active:scale-97 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">
							Réessayer
						</button>
					</div>
				</div>

				<!-- Loading skeletons -->
				<div
					v-else-if="isLoading"
					class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
					<div
						v-for="(_, index) in skeletonItems"
						:key="index"
						class="relative shadow-md rounded-2xl overflow-hidden animate-pulse">
						<!-- Image placeholder -->
						<div class="w-full aspect-square bg-gray-200"></div>

						<!-- Price tag skeleton -->
						<div
							class="absolute top-13 flex items-center px-3 justify-center sm:top-4 right-4 bg-gray-100 h-7 w-20 rounded-full">
							<div class="bg-gray-200 h-2 rounded-full w-full"></div>
						</div>

						<!-- Location tag skeleton -->
						<div
							class="absolute top-4 right-4 flex items-center px-3 justify-end sm:left-1/2 sm:right-auto sm:transform sm:-translate-x-1/2 bg-gray-100 h-7 w-32 rounded-full">
							<div class="md:hidden bg-gray-200 h-2 rounded-full w-full"></div>
						</div>

						<!-- Date badge skeleton -->
						<div class="absolute left-4 top-4 overflow-hidden rounded-lg">
							<div class="w-12 sm:w-14">
								<div class="bg-gray-100 h-5 p-2 w-full">
									<div class="bg-gray-200 h-3 rounded w-1/2"></div>
								</div>
								<div class="bg-gray-100 h-8 p-2 w-full">
									<div class="bg-gray-200 h-3 rounded w-full"></div>
								</div>
							</div>
						</div>

						<!-- Info card skeleton -->
						<div class="absolute inset-0 flex items-end p-3 sm:p-4">
							<div
								class="flex bg-white shadow-md w-full p-3 sm:p-4 rounded-lg flex-col">
								<div class="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
								<div class="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
								<div class="h-3 bg-gray-200 rounded mb-2 w-full"></div>
								<div class="h-3 bg-gray-200 rounded mb-2 w-full"></div>
								<div class="h-3 bg-gray-200 rounded mb-3 w-2/3"></div>
								<div class="flex justify-end">
									<div class="h-8 bg-gray-200 rounded-full w-32"></div>
								</div>
							</div>
						</div>
					</div>
				</div>

				<!-- Empty state -->
				<div
					v-else-if="displayedEvents.length === 0"
					class="mt-12 backdrop-blur-lg bg-white/70 rounded-3xl shadow-lg border-2 border-[#FFFFFF] w-full sm:w-auto text-center max-w-2xl mx-auto transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden">
					<div class="relative p-8 sm:p-10">
						<!-- Glassmorphism accent elements -->
						<div
							class="absolute -top-10 -right-10 w-50 h-50 rounded-full bg-yellow/25 blur-xl"></div>
						<div
							class="absolute -bottom-10 -left-10 w-52 h-52 rounded-full bg-yellow/15 blur-xl"></div>

						<!-- Content -->
						<div class="relative z-10">
							<div
								class="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 sm:mb-8 rounded-full bg-black/5 flex items-center justify-center">
								<span class="text-3xl sm:text-4xl">
									{{ activeTab === "upcoming" ? "🗓️" : "⏱️" }}
								</span>
							</div>

							<h3
								class="text-xl sm:text-2xl font-apercuBold mb-3 sm:mb-5 text-black">
								{{
									activeTab === "upcoming"
										? "Aucun évènement à venir"
										: "Aucun évènement passé"
								}}
							</h3>

							<p
								class="text-black/70 mb-6 sm:mb-8 text-sm sm:text-base max-w-md mx-auto">
								{{
									activeTab === "upcoming"
										? "Revenez bientôt pour découvrir nos prochains évènements."
										: "Consultez les événements à venir."
								}}
							</p>

							<button
								v-if="activeTab === 'past'"
								@click="activeTab = 'upcoming'"
								class="relative inline-flex items-center justify-center px-6 sm:px-8 py-2.5 sm:py-3.5 rounded-full bg-black text-white overflow-hidden transition-all duration-300 hover:bg-black/90 active:scale-97 text-sm sm:text-base"
								aria-label="Voir les événements à venir">
								<span
									class="absolute inset-0 w-full h-full bg-white blur-md opacity-0"></span>
								<span class="relative z-10 flex items-center">
									<span
										class="mr-2 bg-white text-black rounded-full w-6 h-6 flex items-center justify-center"
										>→</span
									>
									Voir les évènements à venir
								</span>
							</button>
						</div>
					</div>
				</div>

				<!-- Events display -->
				<div
					v-else
					class="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
					<div
						v-for="event in displayedEvents"
						:key="event.id"
						tabindex="0"
						class="group relative shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 rounded-2xl overflow-hidden">
						<NuxtImg
							:src="event.imageUrl"
							:alt="event.title"
							format="webp"
							provider="cloudinary"
							@contextmenu.prevent
							class="w-full h-full aspect-square object-cover transition-transform duration-500 group-hover:scale-105"
							:class="{ 'opacity-70 brightness-110 contrast-90': activeTab === 'past' }"
							loading="lazy" />

						<!-- Price tag - now positioned differently on mobile -->
						<div
							class="absolute top-13 sm:top-4 right-4 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-apercuMedium shadow-md">
							{{ formatPrice(event.price) }}
						</div>

						<!-- Location tag - now positioned differently on mobile -->
						<div
							class="absolute top-4 right-4 sm:left-1/2 sm:right-auto max-w-4/6 sm:transform sm:-translate-x-1/2 bg-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-apercuMedium shadow-md flex items-center">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5 text-gray-700"
								viewBox="0 0 20 20"
								fill="currentColor">
								<path
									fill-rule="evenodd"
									d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
									clip-rule="evenodd" />
							</svg>
							<span class="text-gray-700 truncate">
								{{ event.location }}
							</span>
						</div>

						<!-- Past event overlay -->
						<div
							v-if="activeTab === 'past'"
							class="absolute inset-0 pointer-events-none backdrop-blur-[2px] flex items-center justify-center">
							<span
								class="bg-black/90 backdrop-blur-xs text-white px-4 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-apercuMedium">
								Terminé
							</span>
						</div>

						<!-- Date badge -->
						<div
							class="absolute left-4 top-4 overflow-hidden rounded-lg shadow-md">
							<!-- If event has both start and end dates on different days -->
							<template
								v-if="
									event.endDate &&
									new Date(event.startDate).getDate() !==
										new Date(event.endDate).getDate()
								">
								<div class="flex">
									<!-- Start date -->
									<div class="text-center">
										<div
											class="bg-black px-1.5 sm:px-2 py-0.5 sm:py-1 border-r border-gray-700 text-white text-xs font-apercuMedium">
											{{
												new Date(event.startDate)
													.toLocaleString("fr-FR", { month: "short" })
													.toUpperCase()
											}}
										</div>
										<div
											class="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white border-r border-gray-200 text-gray-800 font-apercuBold text-sm sm:text-lg leading-none">
											{{ new Date(event.startDate).getDate() }}
									</div>
									</div>
									<!-- End date -->
									<div class="text-center">
										<div
											class="bg-black px-1.5 sm:px-2 py-0.5 sm:py-1 text-white text-xs font-apercuMedium">
											{{
												new Date(event.endDate)
													.toLocaleString("fr-FR", { month: "short" })
													.toUpperCase()
											}}
										</div>
										<div
											class="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white text-gray-800 font-apercuBold text-sm sm:text-lg leading-none">
											{{ new Date(event.endDate).getDate() }}
										</div>
									</div>
								</div>
							</template>
							<!-- If event has only start date or same-day event -->
							<template v-else>
								<div
									class="bg-black px-2 sm:px-3 py-0.5 sm:py-1 text-center text-white text-xs font-apercuMedium">
									{{
										new Date(event.startDate)
											.toLocaleString("fr-FR", { month: "short" })
											.toUpperCase()
									}}
								</div>
								<div
									class="px-2 sm:px-3 py-0.5 sm:py-1 bg-white text-center text-gray-800 font-apercuBold text-sm sm:text-lg leading-none">
									{{ new Date(event.startDate).getDate() }}
								</div>
							</template>
						</div>
						<!-- Hover overlay with event info -->
						<div class="absolute inset-0 flex items-end p-3 sm:p-4">
							<div
								class="flex bg-white shadow-md w-full p-3 sm:p-4 rounded-lg flex-col">
								<div class="flex items-center text-gray-500 mb-1 text-xs">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
											clip-rule="evenodd" />
									</svg>
									<date>{{
										formatDateRange(
											event.startDate,
											event.endDate,
											event.showStartTime,
											event.showEndTime
										)
									}}</date>
								</div>
								<h4 class="text-base sm:text-xl font-apercuBold">
									{{ event.title }}
								</h4>
								<p
									v-if="event.description"
									class="text-gray-600 line-clamp-2 sm:line-clamp-3 mt-1 sm:mt-2 text-xs sm:text-sm">
									{{ event.description }}
								</p>
								<div
									v-if="event.url"
									class="flex mt-3 sm:mt-4 justify-end items-center">
									<NuxtLink
										:to="event.url"
										target="_blank"
										rel="noopener noreferrer"
										class="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full w-fit bg-black hover:bg-black/90 text-white font-apercuMedium transition-colors active:scale-97 duration-200 shadow-sm text-xs sm:text-sm flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-1.5"
											viewBox="0 0 20 20"
											fill="currentColor">
											<path
												d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
											<path
												d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
										</svg>
										Voir l'évènement
									</NuxtLink>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
