// plugins/haptic-feedback.client.js
export default defineNuxtPlugin(() => {
	// Vérification des capacités haptiques
	const hasHapticSupport = () => {
		return (
			"vibrate" in navigator ||
			"hapticActuators" in navigator ||
			(window.DeviceMotionEvent &&
				typeof DeviceMotionEvent.requestPermission === "function")
		);
	};

	// Détection mobile optimisée
	const isMobile = () => {
		return (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
				navigator.userAgent
			) ||
			(navigator.maxTouchPoints && navigator.maxTouchPoints > 2)
		);
	};

	// Détection iOS pour utiliser les haptics natifs si disponibles
	const isIOS = () => {
		return /iPad|iPhone|iPod/.test(navigator.userAgent);
	};

	// Cache pour éviter les recalculs
	const deviceInfo = {
		mobile: isMobile(),
		ios: isIOS(),
		hapticSupport: hasHapticSupport(),
	};

	// Si pas mobile ou pas de support haptique, on sort
	if (!deviceInfo.mobile || !deviceInfo.hapticSupport) {
		return;
	}

	// Fonction de vibration optimisée avec throttling
	let lastHapticTime = 0;
	const HAPTIC_THROTTLE = 50; // 50ms minimum entre les haptics

	const triggerHaptic = (type = "light") => {
		const now = Date.now();
		if (now - lastHapticTime < HAPTIC_THROTTLE) return;

		lastHapticTime = now;

		try {
			// iOS avec Haptic Feedback API (si disponible)
			if (deviceInfo.ios && window.Haptics) {
				switch (type) {
					case "light":
						window.Haptics.impact({ style: "light" });
						break;
					case "medium":
						window.Haptics.impact({ style: "medium" });
						break;
					case "heavy":
						window.Haptics.impact({ style: "heavy" });
						break;
				}
				return;
			}

			// Fallback avec l'API Vibration standard
			if ("vibrate" in navigator) {
				const patterns = {
					light: [10],
					medium: [20],
					heavy: [30],
					click: [5],
				};
				navigator.vibrate(patterns[type] || patterns.light);
			}
		} catch (error) {
			// Silencieux en cas d'erreur
			console.debug("Haptic feedback not available:", error);
		}
	};

	// Sélecteurs optimisés pour les éléments interactifs
	const interactiveSelectors = [
		"a[href]",
		"button",
		'[role="button"]',
		'[tabindex]:not([tabindex="-1"])',
		'input[type="button"]',
		'input[type="submit"]',
		'input[type="checkbox"]',
		'input[type="radio"]',
		".nuxt-link",
		".haptic-enabled",
	];

	// Gestionnaire d'événements optimisé avec délégation
	const handleInteraction = (event) => {
		const target = event.target.closest(interactiveSelectors.join(","));

		if (!target) return;

		// Éviter les haptics sur les éléments désactivés
		if (target.disabled || target.getAttribute("aria-disabled") === "true")
			return;

		// Type de haptic basé sur l'élément
		let hapticType = "light";

		if (target.hasAttribute("data-haptic-type")) {
			hapticType = target.getAttribute("data-haptic-type");
		} else if (
			target.tagName === "BUTTON" ||
			target.getAttribute("role") === "button"
		) {
			hapticType = "medium";
		} else if (target.type === "submit") {
			hapticType = "heavy";
		}

		triggerHaptic(hapticType);
	};

	// Options pour l'event listener (passive pour les performances)
	const listenerOptions = {
		passive: true,
		capture: true,
	};

	// Ajout des event listeners avec délégation d'événements
	document.addEventListener("touchstart", handleInteraction, listenerOptions);

	// Fallback pour les clics (au cas où touchstart ne fonctionne pas)
	document.addEventListener(
		"click",
		(event) => {
			// Seulement si pas de touch
			if (event.detail === 0) return; // Évite les clics programmatiques
			handleInteraction(event);
		},
		listenerOptions
	);

	// Cleanup function pour le Hot Module Replacement
	if (process.dev) {
		const cleanup = () => {
			document.removeEventListener(
				"touchstart",
				handleInteraction,
				listenerOptions
			);
			document.removeEventListener("click", handleInteraction, listenerOptions);
		};

		// Nettoyage lors du HMR
		if (module.hot) {
			module.hot.dispose(cleanup);
		}
	}

	// Exposition d'une fonction utilitaire globale
	return {
		provide: {
			haptic: {
				trigger: triggerHaptic,
				isSupported: () => deviceInfo.mobile && deviceInfo.hapticSupport,
				deviceInfo,
			},
		},
	};
});
