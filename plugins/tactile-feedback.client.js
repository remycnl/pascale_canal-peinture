export default defineNuxtPlugin(() => {
	if (process.client) {
		// Détection mobile uniquement
		const isMobile =
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			);

		if (!isMobile) return; // Ne rien faire sur desktop

		// Fonction pour vibration type iPhone (pattern court et net)
		const hapticFeedback = () => {
			if (navigator.vibrate) {
				// Pattern qui imite le taptic feedback iOS : court et précis
				navigator.vibrate([3]);
			}
		};

		// Fonction pour ajouter la vibration à un élément
		const addVibrationToElement = (element) => {
			if (!element._hapticAdded) {
				// Utiliser plusieurs événements pour couvrir tous les cas
				const events = ['touchstart', 'pointerdown', 'mousedown'];
				
				events.forEach(eventType => {
					element.addEventListener(eventType, (e) => {
						// Vérifier si c'est un vrai toucher (pas un clic simulé)
						if (eventType === 'touchstart' || 
						    (eventType === 'pointerdown' && e.pointerType === 'touch') ||
						    (eventType === 'mousedown' && e.isTrusted)) {
							hapticFeedback();
						}
					}, { passive: true });
				});
				
				element._hapticAdded = true;
			}
		};

		// Fonction pour traiter tous les éléments cliquables
		const processClickableElements = () => {
			// Tous les liens (y compris NuxtLinks rendus)
			const links = document.querySelectorAll("a");
			links.forEach(addVibrationToElement);

			// Boutons
			const buttons = document.querySelectorAll("button");
			buttons.forEach(addVibrationToElement);

			// Éléments avec rôle clickable
			const clickables = document.querySelectorAll(
				'[role="button"], .clickable, [onclick], input[type="button"], input[type="submit"]'
			);
			clickables.forEach(addVibrationToElement);
		};

		// Observer pour les nouveaux éléments (important pour les SPA)
		const observer = new MutationObserver((mutations) => {
			let shouldProcess = false;
			
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						// Si c'est directement un élément cliquable
						if (
							node.tagName === "A" ||
							node.tagName === "BUTTON" ||
							(node.hasAttribute?.("role") && 
							 node.getAttribute("role") === "button") ||
							node.hasAttribute?.("onclick")
						) {
							addVibrationToElement(node);
							shouldProcess = true;
						}
						
						// Chercher dans les enfants
						if (node.querySelectorAll) {
							const clickableElements = node.querySelectorAll(
								'a, button, [role="button"], .clickable, [onclick], input[type="button"], input[type="submit"]'
							);
							if (clickableElements.length > 0) {
								clickableElements.forEach(addVibrationToElement);
								shouldProcess = true;
							}
						}
					}
				});
			});
		});

		// Hook pour les changements de route Nuxt
		const { $router } = useNuxtApp();
		if ($router) {
			$router.afterEach(() => {
				// Petit délai pour laisser le DOM se mettre à jour
				setTimeout(() => {
					processClickableElements();
				}, 50);
			});
		}

		// Fonction de démarrage
		const startHaptics = () => {
			processClickableElements();
			
			// Commencer l'observation des mutations
			observer.observe(document.body, {
				childList: true,
				subtree: true,
			});
		};

		// Démarrage initial
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", startHaptics);
		} else {
			// Petit délai pour s'assurer que Nuxt a fini son hydratation
			setTimeout(startHaptics, 100);
		}

		// Nettoyage au unmount
		if (process.client) {
			window.addEventListener('beforeunload', () => {
				observer.disconnect();
			});
		}
	}
});