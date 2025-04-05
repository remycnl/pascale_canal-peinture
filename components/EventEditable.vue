<script setup>
import { onMounted, computed, ref } from "vue";
import { useEvents } from "@/composables/useEvents";

const {
	events,
	refresh,
	createEvent,
	updateEvent,
	deleteEvent,
	formatDate,
	formatDateForInput,
} = useEvents();

const isAdding = ref(false);
const searchQuery = ref("");

const sortedEvents = computed(() => {
	const filtered = [...(events.value || [])].filter(
		(event) =>
			event.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
			event.description
				.toLowerCase()
				.includes(searchQuery.value.toLowerCase()) ||
			event.location.toLowerCase().includes(searchQuery.value.toLowerCase())
	);

	return filtered.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
});

onMounted(async () => {
	await refresh();
	initializeTextareas();
});

const addEvent = async () => {
	isAdding.value = true;

	try {
		const newEvent = await createEvent({
			title: "",
			description: "",
			location: "",
			price: null,
			startDate: null,
			endDate: null,
			imageUrl: "",
			isActive: true,
		});

		setTimeout(() => {
			initializeTextareas();
			const newEventElement = document.getElementById(`event-${newEvent.id}`);
			if (newEventElement) {
				newEventElement.scrollIntoView({ behavior: "smooth", block: "start" });
				const firstInput = newEventElement.querySelector("input");
				if (firstInput) firstInput.focus();
			}
		}, 100);

		isAdding.value = false;
		return newEvent;
	} catch (error) {
		console.error("Error adding event:", error);
		isAdding.value = false;
	}
};

const toggleActive = async (event) => {
	try {
		event.isActive = !event.isActive;
		await updateEvent(event.id, event);
	} catch (error) {
		console.error("Error toggling active state:", error);
		event.isActive = !event.isActive;
	}
};

const updateEventData = async (event) => {
	try {
		await updateEvent(event.id, event);
	} catch (error) {
		console.error("Error updating event:", error);
	}
};

const removeEvent = async (id) => {
	if (confirm("Êtes-vous sûr de vouloir supprimer cet événement ?")) {
		try {
			await deleteEvent(id);
		} catch (error) {
			console.error("Error deleting event:", error);
		}
	}
};

const handleDateChange = (event, field, value) => {
	if (value) {
		event[field] = new Date(value).toISOString();
		updateEventData(event);
	}
};

const autoResize = (element) => {
	element.style.height = "auto";
	element.style.height = element.scrollHeight + "px";
};

const initializeTextareas = () => {
	setTimeout(() => {
		document.querySelectorAll("textarea").forEach((textarea) => {
			autoResize(textarea);
		});
	}, 0);
};

const previewImage = (url) => {
	if (!url) return "/img/placeholder-event.jpg";
	return url;
};
</script>

<template>
	<div
		class="mt-20 md:mt-40 flex flex-col gap-y-10 md:gap-y-30 justify-center items-center">
		<div class="w-full flex items-center mb-8">
			<div
				class="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
			<div class="mx-2 sm:mx-4">
				<NuxtImg
					src="/img/logo.png"
					alt="Logo"
					format="webp"
					class="w-16 sm:w-20 md:w-28 h-auto" />
			</div>
			<div
				class="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
		</div>

		<div
			class="w-full max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
			<!-- Header with fixed position -->
			<div class="bg-black text-white p-4 sm:p-6">
				<div class="flex flex-col sm:flex-row justify-between items-center">
					<h2
						class="text-2xl sm:text-3xl font-apercuBold mb-4 sm:mb-0 flex items-center">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-8 w-8 mr-2 text-yellow"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
								clip-rule="evenodd" />
						</svg>
						Gestion des Événements
					</h2>
					<button
						@click="addEvent"
						class="bg-yellow active:scale-95 text-black px-4 py-2 rounded-lg hover:bg-yellow/90 transition-all duration-200 flex items-center shadow-md"
						:disabled="isAdding">
						<svg
							v-if="!isAdding"
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 mr-2"
							viewBox="0 0 20 20"
							fill="currentColor">
							<path
								fill-rule="evenodd"
								d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
								clip-rule="evenodd" />
						</svg>
						<svg
							v-else
							class="animate-spin h-5 w-5 mr-2"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								class="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								stroke-width="4"></circle>
							<path
								class="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
						</svg>
						{{ isAdding ? "Création..." : "Ajouter un Événement" }}
					</button>
				</div>

				<!-- Search bar with glassmorphism -->
				<div class="mt-4 relative">
					<div
						class="relative backdrop-blur-sm bg-white/10 rounded-xl overflow-hidden shadow-lg border border-white/20">
						<input
							v-model="searchQuery"
							type="text"
							placeholder="Rechercher des événements..."
							class="w-full px-4 py-3 bg-transparent text-white placeholder-gray-300 focus:outline-none pl-10" />
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5 absolute left-3 top-3.5 text-white/70"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
				</div>
			</div>

			<div
				v-if="sortedEvents.length === 0"
				class="text-center py-16 bg-gray-50">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-16 w-16 mx-auto text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="mt-4 text-gray-600">
					{{
						searchQuery
							? "Aucun événement ne correspond à votre recherche."
							: 'Aucun événement disponible. Cliquez sur "Ajouter un Événement" pour commencer.'
					}}
				</p>
			</div>

			<div class="max-h-[70vh] overflow-y-auto">
				<div class="divide-y divide-gray-200">
					<div
						v-for="event in sortedEvents"
						:key="event.id"
						:id="`event-${event.id}`"
						class="p-6 hover:bg-gray-50 transition-colors group relative">
						<div class="flex flex-col sm:flex-row gap-6">
							<!-- Left side - Image preview -->
							<div class="sm:w-1/4">
								<div
									class="relative rounded-xl overflow-hidden aspect-[4/3] bg-gray-100 shadow-md">
									<NuxtImg
										:src="previewImage(event.imageUrl)"
										:alt="event.title"
										loading="lazy"
										fit="cover"
										format="webp"
										class="w-full h-full" />
									<div
										class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
										<input
											v-model="event.imageUrl"
											@change="updateEventData(event)"
											class="w-full px-3 py-2 bg-white/90 focus:outline-none"
											placeholder="URL de l'image" />
									</div>
								</div>
							</div>

							<!-- Right side - Event details -->
							<div class="sm:w-3/4">
								<div class="flex justify-between items-start">
									<input
										v-model="event.title"
										@change="updateEventData(event)"
										class="w-11/12 transition-colors duration-200 hover:bg-gray-100 px-3 py-2 rounded-xl text-xl font-apercuMediumbold text-black mb-2 border-2 border-transparent focus:border-black focus:outline-none"
										placeholder="Titre de l'événement" />

									<button
										@click="removeEvent(event.id)"
										class="text-gray-500 hover:text-red-600 active:scale-95 transition-all p-2 rounded-full duration-200"
										title="Supprimer">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
										</svg>
									</button>
								</div>

								<textarea
									v-model="event.description"
									@change="updateEventData(event)"
									@input="autoResize($event.target)"
									class="w-11/12 px-3 py-2 rounded-xl text-gray-700 transition-colors duration-200 hover:bg-gray-100 min-h-[60px] overflow-hidden resize-none mb-3 focus:outline-none focus:ring-2 focus:ring-black"
									placeholder="Description de l'événement"></textarea>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
									<div class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 text-gray-500 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
										</svg>
										<input
											v-model="event.location"
											@change="updateEventData(event)"
											class="w-full px-2 py-1 rounded-lg text-base transition-colors duration-200 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-black"
											placeholder="Lieu de l'événement" />
									</div>

									<div class="flex items-center">
										<svg
											xmlns="http://www.w3.org/2000/svg"
											class="h-5 w-5 text-gray-500 mr-2"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor">
											<path
												stroke-linecap="round"
												stroke-linejoin="round"
												stroke-width="2"
												d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<div class="flex items-center">
											<input
												v-model.number="event.price"
												@change="updateEventData(event)"
												type="number"
												step="0.01"
												min="0"
												placeholder="Prix"
												class="w-24 px-2 py-1 rounded-lg focus:outline-none transition-colors duration-200 hover:bg-gray-100 focus:ring-2 focus:ring-black" />
											<span class="ml-1 text-gray-700">€</span>
										</div>
									</div>
								</div>

								<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 mb-2">
									<div>
										<div class="flex items-center mb-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5 text-gray-500 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											<label class="text-sm text-gray-600">Date de début</label>
										</div>
										<input
											:value="formatDateForInput(event.startDate)"
											@change="
												(e) =>
													handleDateChange(event, 'startDate', e.target.value)
											"
											type="datetime-local"
											class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-yellow" />
										<div class="text-sm text-gray-600 mt-1">
											{{
												event.startDate
													? new Date(event.startDate).toLocaleString("fr-FR", {
															weekday: "long",
															day: "numeric",
															month: "long",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
													  })
													: ""
											}}
										</div>
									</div>
									<div>
										<div class="flex items-center mb-1">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												class="h-5 w-5 text-gray-500 mr-2"
												fill="none"
												viewBox="0 0 24 24"
												stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
											</svg>
											<label class="text-sm text-gray-600">Date de fin</label>
										</div>
										<input
											:value="formatDateForInput(event.endDate)"
											@change="
												(e) =>
													handleDateChange(event, 'endDate', e.target.value)
											"
											type="datetime-local"
											class="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-1 focus:ring-yellow" />
										<div class="text-sm text-gray-600 mt-1">
											{{
												event.endDate
													? new Date(event.endDate).toLocaleString("fr-FR", {
															weekday: "long",
															day: "numeric",
															month: "long",
															year: "numeric",
															hour: "2-digit",
															minute: "2-digit",
													  })
													: ""
											}}
										</div>
									</div>
								</div>

								<div
									class="text-xs text-gray-400 flex justify-between items-center mt-8">
									<span> Créé le : {{ formatDate(event.createdAt) }} </span>
									<div class="flex items-center space-x-2">
										<label
											class="switch"
											:title="
												event.isActive
													? 'Événement actif - Cliquez pour désactiver'
													: 'Événement inactif - Cliquez pour activer'
											">
											<input
												type="checkbox"
												:checked="event.isActive"
												@change="toggleActive(event)" />
											<span class="slider"></span>
										</label>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.switch {
	position: relative;
	display: inline-block;
	width: 2.8em;
	height: 1.4em;
}

.switch input {
	display: none;
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--color-black);
	transition: 0.2s;
	border-radius: 30px;
}

.slider:before {
	position: absolute;
	content: "";
	height: 1em;
	width: 1em;
	border-radius: 20px;
	left: 0.2em;
	bottom: 0.2em;
	background-color: #aeaaae;
	transition: 0.4s;
}

input:checked + .slider::before {
	background-color: var(--color-yellow);
}

input:checked + .slider {
	background-color: #7c7541;
}

input:focus + .slider {
	box-shadow: 0 0 1px #7c7541;
}

input:checked + .slider:before {
	transform: translateX(1.4em);
}
</style>
