// plugins/haptic-feedback.client.js
export default defineNuxtPlugin(() => {
	// Vérifier si on est côté client
	if (process.server) return;

	// Détection mobile améliorée
	const isMobile = () => {
		if (typeof window === "undefined" || typeof navigator === "undefined")
			return false;

		return (
			/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) ||
			"ontouchstart" in window ||
			(navigator.maxTouchPoints && navigator.maxTouchPoints > 0)
		);
	};

	// Vérifier si on est sur mobile
	if (!isMobile()) {
		console.log("Haptic: Not on mobile device");
		return {
			provide: {
				haptic: {
					vibrate: () => console.log("Haptic: Not available on desktop"),
					test: () => console.log("Haptic: Not available on desktop"),
				},
			},
		};
	}

	// Vérifier le support de vibration
	if (!navigator.vibrate) {
		console.log("Haptic: Vibration API not supported");
		return {
			provide: {
				haptic: {
					vibrate: () => console.log("Haptic: API not supported"),
					test: () => console.log("Haptic: API not supported"),
				},
			},
		};
	}

	console.log("Haptic: Plugin initialized on mobile device");

	// Fonction de vibration avec gestion d'erreur améliorée
	let lastVibration = 0;
	const vibrate = (pattern = [10]) => {
		const now = Date.now();
		// Throttle à 100ms pour éviter le spam
		if (now - lastVibration < 100) return false;

		lastVibration = now;

		try {
			// S'assurer que le pattern est correct
			let vibrationPattern;
			if (Array.isArray(pattern)) {
				vibrationPattern = pattern;
			} else if (typeof pattern === "number") {
				vibrationPattern = [pattern];
			} else {
				vibrationPattern = [10];
			}

			const result = navigator.vibrate(vibrationPattern);
			console.log("Haptic triggered:", vibrationPattern, "Success:", result);
			return result;
		} catch (error) {
			console.error("Haptic error:", error);
			return false;
		}
	};

	// Patterns de vibration
	const patterns = {
		light: [10],
		medium: [20],
		heavy: [30, 10, 30],
		click: [5],
		success: [50, 30, 50],
		error: [100, 50, 100, 50, 100],
	};

	// Sélecteurs d'éléments interactifs
	const isInteractive = (element) => {
		if (!element || !element.tagName) return false;

		const tagName = element.tagName.toLowerCase();
		const role = element.getAttribute("role");
		const type = element.getAttribute("type");

		return (
			tagName === "a" ||
			tagName === "button" ||
			type === "button" ||
			type === "submit" ||
			role === "button" ||
			element.classList.contains("nuxt-link-active") ||
			element.classList.contains("nuxt-link-exact-active") ||
			element.hasAttribute("href") ||
			element.hasAttribute("data-haptic") ||
			element.onclick !== null ||
			element.getAttribute("tabindex") === "0"
		);
	};

	// Gestionnaire d'événement avec meilleure logique
	const handleTouch = (event) => {
		if (!event.target) return;

		let target = event.target;
		let depth = 0;
		const maxDepth = 5;

		// Remonter dans l'arbre DOM pour trouver un élément interactif
		while (target && depth < maxDepth) {
			if (isInteractive(target)) {
				// Ignorer les éléments désactivés
				if (
					target.disabled ||
					target.getAttribute("aria-disabled") === "true" ||
					target.classList.contains("disabled")
				) {
					return;
				}

				// Déterminer le type de vibration
				let patternType = "light";

				if (target.hasAttribute("data-haptic-type")) {
					patternType = target.getAttribute("data-haptic-type");
				} else if (target.hasAttribute("data-haptic")) {
					patternType = target.getAttribute("data-haptic") || "light";
				} else if (
					target.tagName.toLowerCase() === "button" ||
					target.getAttribute("role") === "button" ||
					target.getAttribute("type") === "button"
				) {
					patternType = "medium";
				} else if (target.tagName.toLowerCase() === "a") {
					patternType = "light";
				}

				const success = vibrate(patterns[patternType] || patterns.light);
				if (success) {
					console.log(
						"Haptic triggered for:",
						target.tagName,
						target.className || target.id || "unnamed"
					);
				}
				break;
			}
			target = target.parentElement;
			depth++;
		}
	};

	// Fonction d'initialisation avec gestion des erreurs
	const initializeHaptic = () => {
		try {
			// Ajouter l'event listener
			document.addEventListener("touchstart", handleTouch, {
				passive: true,
				capture: false,
			});

			console.log("Haptic: Event listener added");

			// Test initial avec délai pour s'assurer que tout est chargé
			setTimeout(() => {
				console.log("Haptic: Testing vibration...");
				const testResult = vibrate([50]);
				if (!testResult) {
					console.warn(
						"Haptic: Test vibration failed - may need user interaction first"
					);
				}
			}, 2000);
		} catch (error) {
			console.error("Haptic: Failed to initialize:", error);
		}
	};

	// Initialiser quand le DOM est prêt
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializeHaptic);
	} else {
		initializeHaptic();
	}

	// API publique améliorée
	const hapticAPI = {
		vibrate: (type = "light") => {
			if (typeof type === "string") {
				return vibrate(patterns[type] || patterns.light);
			} else if (Array.isArray(type) || typeof type === "number") {
				return vibrate(type);
			} else {
				return vibrate(patterns.light);
			}
		},

		test: () => vibrate([100, 50, 100]),

		patterns,

		// Nouvelle méthode pour tester si l'API fonctionne
		isSupported: () => !!navigator.vibrate && isMobile(),

		// Méthode pour arrêter toute vibration
		stop: () => {
			try {
				return navigator.vibrate(0);
			} catch (error) {
				console.error("Haptic stop error:", error);
				return false;
			}
		},
	};

	// Nettoyer en mode dev (fix pour la syntaxe Nuxt 3)
	if (process.dev) {
		// Utiliser onBeforeUnmount ou window.addEventListener('beforeunload')
		window.addEventListener("beforeunload", () => {
			document.removeEventListener("touchstart", handleTouch);
		});
	}

	// Fournir l'API globale
	return {
		provide: {
			haptic: hapticAPI,
		},
	};
});
