export const usePageTitle = () => {
	const inactiveTitle = useState(
		"inactiveTitle",
		() => "Psst... Reviens vite ! 🥺"
	);
	const pageTitle = useState(
		"pageTitle",
		() => "Pascale Canal | Artiste Peintre • Exposition en ligne"
	);

	const setPageTitle = (newTitle) => {
		pageTitle.value = newTitle;
		if (import.meta.client) {
			document.title = newTitle;
		}
	};

	const setInactiveTitle = (newInactiveTitle) => {
		inactiveTitle.value = newInactiveTitle;
	};

	return {
		pageTitle: readonly(pageTitle),
		inactiveTitle: readonly(inactiveTitle),
		setPageTitle,
		setInactiveTitle,
	};
};
