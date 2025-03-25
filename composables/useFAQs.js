export const useFAQs = () => {
	const fetchFAQs = async () => {
		try {
			const data = await $fetch("/api/faqs");
			return data || [];
		} catch (err) {
			console.error("Failed to fetch FAQs:", err);
			throw err;
		}
	};

	const createFAQ = async (faqData) => {
		try {
			const data = await $fetch("/api/faqs", {
				method: "POST",
				body: faqData,
			});
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
			return data;
		} catch (err) {
			console.error("Failed to update FAQ:", err);
			throw err;
		}
	};

	const deleteFAQ = async (id) => {
		try {
			const data = await $fetch(`/api/faqs/${id}`, {
				method: "DELETE",
			});
			return data;
		} catch (err) {
			console.error("Failed to delete FAQ:", err);
			throw err;
		}
	};

	return {
		fetchFAQs,
		createFAQ,
		updateFAQ,
		deleteFAQ,
	};
};
