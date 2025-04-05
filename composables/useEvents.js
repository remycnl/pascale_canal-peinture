import { reactive, computed, ref } from "vue";

export function useEvents() {
	const {
		data: events,
		status: eventsLoading,
		error,
		refresh: refreshEvents,
	} = useFetch("/api/events", {
		server: true,
		key: "events",
	});

	// États de chargement spécifiques
	const upcomingEventsLoading = ref(false);
	const pastEventsLoading = ref(false);

	// Get active events only
	const activeEvents = computed(() => {
		return events.value?.filter((event) => event.isActive) || [];
	});

	// Get upcoming events (sorted by closest to furthest)
	const upcomingEvents = computed(() => {
		const today = new Date();
		return activeEvents.value
			.filter((event) => new Date(event.startDate) >= today)
			.sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
			.filter(
				(event) =>
					event.imageUrl && event.title && event.location && event.startDate
			);
	});

	// Get past events (sorted by closest to furthest)
	const pastEvents = computed(() => {
		const today = new Date();
		return activeEvents.value
			.filter((event) => new Date(event.startDate) < today)
			.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
			.filter(
				(event) =>
					event.imageUrl && event.title && event.location && event.startDate
			);
	});

	// Current event being edited
	const currentEvent = reactive({
		id: null,
		title: "",
		description: "",
		location: "",
		price: null,
		startDate: null,
		showStartTime: true,
		endDate: null,
		showEndTime: true,
		imageUrl: "",
		isActive: true,
	});

	// Reset current event to defaults
	const resetCurrentEvent = () => {
		Object.assign(currentEvent, {
			id: null,
			title: "",
			description: "",
			location: "",
			price: null,
			startDate: null,
			showStartTime: true,
			endDate: null,
			showEndTime: true,
			imageUrl: "",
			isActive: true,
		});
	};

	// Récupération spécifique des événements à venir
	const fetchUpcomingEvents = async () => {
		upcomingEventsLoading.value = true;
		try {
			await refresh();
			return upcomingEvents.value;
		} catch (err) {
			console.error("Failed to load upcoming events:", err);
			throw err;
		} finally {
			upcomingEventsLoading.value = false;
		}
	};

	// Récupération spécifique des événements passés
	const fetchPastEvents = async () => {
		pastEventsLoading.value = true;
		try {
			await refresh();
			return pastEvents.value;
		} catch (err) {
			console.error("Failed to load past events:", err);
			throw err;
		} finally {
			pastEventsLoading.value = false;
		}
	};

	// More robust refresh function
	const refresh = async () => {
		await refreshEvents();
		return events.value;
	};

	// Get a single event
	const getEvent = async (id) => {
		try {
			const event = await $fetch(`/api/events/${id}`);
			Object.assign(currentEvent, event);
			return event;
		} catch (err) {
			console.error(`Failed to load event #${id}:`, err);
			throw err;
		}
	};

	// Create a new event
	const createEvent = async (eventData) => {
		try {
			const formattedData = { ...eventData };
			if (typeof formattedData.price === "number") {
				formattedData.price = formattedData.price.toString();
			}

			const data = await $fetch("/api/events", {
				method: "POST",
				body: formattedData,
			});

			await refresh();
			return data;
		} catch (err) {
			console.error("Failed to create event:", err);
			throw err;
		}
	};

	// Update an existing event
	const updateEvent = async (id, eventData) => {
		try {
			const formattedData = { ...eventData };
			if (typeof formattedData.price === "number") {
				formattedData.price = formattedData.price.toString();
			}

			const data = await $fetch(`/api/events/${id}`, {
				method: "PUT",
				body: formattedData,
			});

			await refresh();
			return data;
		} catch (err) {
			console.error(`Failed to update event #${id}:`, err);
			throw err;
		}
	};

	// Delete an event
	const deleteEvent = async (id) => {
		try {
			await $fetch(`/api/events/${id}`, {
				method: "DELETE",
			});

			await refresh();
			return true;
		} catch (err) {
			console.error(`Failed to delete event #${id}:`, err);
			throw err;
		}
	};

  // Format date for display
  const formatDate = (dateString, showTime = true) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      timeZone: 'Europe/Paris'
    };

    if (showTime) {
      options.hour = "2-digit";
      options.minute = "2-digit";
    }

    return date.toLocaleDateString("fr-FR", options);
  };

  const formatDateForInput = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "";

    const formatter = new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone: 'Europe/Paris'
    });

    const parts = formatter.formatToParts(date);
    const dateParts = {};
    
    parts.forEach(part => {
      if (part.type !== 'literal') {
        dateParts[part.type] = part.value;
      }
    });
    
    return `${dateParts.year}-${dateParts.month}-${dateParts.day}T${dateParts.hour}:${dateParts.minute}`;
  };

	return {
		events,
		activeEvents,
		upcomingEvents,
		pastEvents,
		currentEvent,
		isLoading: eventsLoading,
		upcomingEventsLoading,
		pastEventsLoading,
		error,
		refresh,
		fetchUpcomingEvents,
		fetchPastEvents,
		getEvent,
		createEvent,
		updateEvent,
		deleteEvent,
		resetCurrentEvent,
		formatDate,
		formatDateForInput,
	};
}
