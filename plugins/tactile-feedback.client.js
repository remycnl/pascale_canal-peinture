export default defineNuxtPlugin(() => {
	if (process.client) {
		// Fonction pour ajouter la vibration à un lien
		const addVibrationToLink = (link) => {
			if (!link._tactileAdded) {
				link.addEventListener("click", () => {
					if (navigator.vibrate) {
						navigator.vibrate(15);
					}
				});
				link._tactileAdded = true;
			}
		};

		// Fonction pour traiter tous les NuxtLinks
		const processNuxtLinks = () => {
			const nuxtLinks = document.querySelectorAll("a[data-nuxt-link]");
			nuxtLinks.forEach(addVibrationToLink);
		};

		// Observer pour détecter les nouveaux NuxtLinks ajoutés dynamiquement
		const observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						// Si le noeud est lui-même un NuxtLink
						if (node.hasAttribute && node.hasAttribute("data-nuxt-link")) {
							addVibrationToLink(node);
						}
						// Chercher les NuxtLinks dans les enfants
						if (node.querySelectorAll) {
							const childLinks = node.querySelectorAll("a[data-nuxt-link]");
							childLinks.forEach(addVibrationToLink);
						}
					}
				});
			});
		});

		// Démarrer l'observation une fois le DOM prêt
		onMounted(() => {
			// Traiter les liens existants
			processNuxtLinks();

			// Observer les futurs liens
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		});

		// Nettoyer l'observer quand nécessaire
		onBeforeUnmount(() => {
			observer.disconnect();
		});
	}
});
