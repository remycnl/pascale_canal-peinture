import { reactive, computed } from "vue";

export function useEvents() {
  const {
    data: events,
    status: isLoading,
    error,
    refresh: refreshEvents,
  } = useFetch("/api/events", {
    server: true,
    key: "events",
  });

  // Get active events only
  const activeEvents = computed(() => {
    return events.value?.filter((event) => event.isActive) || [];
  });

  // Current event being edited
  const currentEvent = reactive({
    id: null,
    title: "",
    description: "",
    location: "",
    price: null,
    startDate: null,
    endDate: null,
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
      endDate: null,
      imageUrl: "",
      isActive: true,
    });
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
      // Handle price formatting for Prisma's Decimal type
      const formattedData = { ...eventData };
      if (typeof formattedData.price === 'number') {
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
      // Handle price formatting for Prisma's Decimal type
      const formattedData = { ...eventData };
      if (typeof formattedData.price === 'number') {
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
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  // Format date for input fields
  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().slice(0, 16);
  };

  return {
    events,
    activeEvents,
    currentEvent,
    isLoading,
    error,
    refresh,
    getEvent,
    createEvent,
    updateEvent,
    deleteEvent,
    resetCurrentEvent,
    formatDate,
    formatDateForInput
  };
}