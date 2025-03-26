export const useFAQs = () => {
	const {
		data: faqs,
		pending,
		error,
		refresh,
	} = useFetch("/api/faqs", {
		server: true,
		key: "faqs",
	});

	const createFAQ = async (faqData) => {
		try {
			const data = await $fetch("/api/faqs", {
				method: "POST",
				body: faqData,
			});
			refresh();
			return data;
		} catch (err) {
			console.error("Failed to create FAQ:", err);
			throw err;
		}
	};

	const updateFAQ = async (id, faqData) => {
		try {
			const data = await $fetch(`/api/faqs/${id}`, {
				method: "PUT",
				body: faqData,
			});
			refresh();
			return data;
		} catch (err) {
			console.error("Failed to update FAQ:", err);
			throw err;
		}
	};

	const deleteFAQ = async (id) => {
		try {
			await $fetch(`/api/faqs/${id}`, {
				method: "DELETE",
			});
			refresh();
		} catch (err) {
			console.error("Failed to delete FAQ:", err);
			throw err;
		}
	};

	return {
		faqs,
		pending,
		error,
		refresh,
		createFAQ,
		updateFAQ,
		deleteFAQ,
	};
};
