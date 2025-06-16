// plugins/haptic-feedback.client.js - Version iOS compatible
export default defineNuxtPlugin(() => {
	if (process.server) return;

	// Détection spécifique iOS et navigateur
	const isIOS = () => {
		return (
			/iPad|iPhone|iPod/.test(navigator.userAgent) ||
			(navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)
		);
	};

	const isSafari = () => {
		return (
			/Safari/.test(navigator.userAgent) &&
			!/Chrome|CriOS|FxiOS/.test(navigator.userAgent)
		);
	};

	const isChrome = () => {
		return (
			/CriOS/.test(navigator.userAgent) || /Chrome/.test(navigator.userAgent)
		);
	};

	const isAndroid = () => {
		return /Android/.test(navigator.userAgent);
	};

	console.log("Haptic: Device detection", {
		isIOS: isIOS(),
		isSafari: isSafari(),
		isChrome: isChrome(),
		isAndroid: isAndroid(),
		hasVibrate: "vibrate" in navigator,
		userAgent: navigator.userAgent,
	});

	// Fonction de vibration avec fallbacks iOS
	const createHapticFunction = () => {
		// 1. Safari sur iOS - API Vibration classique
		if (isIOS() && isSafari() && "vibrate" in navigator) {
			console.log("Haptic: Using Safari iOS vibration API");
			return (pattern = [10]) => {
				try {
					return navigator.vibrate(pattern);
				} catch (error) {
					console.error("Safari vibration error:", error);
					return false;
				}
			};
		}

		// 2. Chrome sur iOS - Pas de vibration disponible, utiliser alternatives
		if (isIOS() && isChrome()) {
			console.log("Haptic: Chrome on iOS - No vibration support");
			return (pattern = [10]) => {
				console.log("Haptic: Chrome iOS - Vibration would trigger:", pattern);
				// Alternative : animation visuelle ou son
				triggerVisualFeedback();
				return false;
			};
		}

		// 3. Android - API Vibration standard
		if (isAndroid() && "vibrate" in navigator) {
			console.log("Haptic: Using Android vibration API");
			return (pattern = [10]) => {
				try {
					return navigator.vibrate(pattern);
				} catch (error) {
					console.error("Android vibration error:", error);
					return false;
				}
			};
		}

		// 4. Fallback - Pas de support
		console.log("Haptic: No vibration support available");
		return (pattern = [10]) => {
			console.log("Haptic: No support - would vibrate:", pattern);
			triggerVisualFeedback();
			return false;
		};
	};

	// Alternative visuelle pour les navigateurs sans support vibration
	const triggerVisualFeedback = () => {
		// Créer un feedback visuel subtil
		const feedback = document.createElement("div");
		feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      width: 20px;
      height: 20px;
      background: rgba(0, 123, 255, 0.3);
      border-radius: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 9999;
      animation: hapticPulse 0.15s ease-out;
    `;

		// Ajouter l'animation CSS si elle n'existe pas
		if (!document.querySelector("#hapticAnimation")) {
			const style = document.createElement("style");
			style.id = "hapticAnimation";
			style.textContent = `
        @keyframes hapticPulse {
          0% { transform: translate(-50%, -50%) scale(0); opacity: 0.7; }
          50% { transform: translate(-50%, -50%) scale(1); opacity: 0.4; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `;
			document.head.appendChild(style);
		}

		document.body.appendChild(feedback);
		setTimeout(() => feedback.remove(), 150);
	};

	// Initialiser la fonction de vibration
	const vibrate = createHapticFunction();

	// Patterns de vibration
	const patterns = {
		light: [10],
		medium: [20],
		heavy: [30, 10, 30],
		click: [5],
		success: [50, 30, 50],
		error: [100, 50, 100, 50, 100],
	};

	// Détection d'éléments interactifs (identique)
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
			element.onclick !== null
		);
	};

	// Gestionnaire tactile avec throttling
	let lastHaptic = 0;
	const handleTouch = (event) => {
		const now = Date.now();
		if (now - lastHaptic < 100) return; // Throttle 100ms

		let target = event.target;
		let depth = 0;

		while (target && depth < 5) {
			if (isInteractive(target)) {
				if (
					target.disabled ||
					target.getAttribute("aria-disabled") === "true"
				) {
					return;
				}

				let patternType = "light";

				if (target.hasAttribute("data-haptic-type")) {
					patternType = target.getAttribute("data-haptic-type");
				} else if (target.hasAttribute("data-haptic")) {
					patternType = target.getAttribute("data-haptic") || "light";
				} else if (target.tagName.toLowerCase() === "button") {
					patternType = "medium";
				}

				lastHaptic = now;
				vibrate(patterns[patternType] || patterns.light);
				console.log("Haptic triggered for:", target.tagName, patternType);
				break;
			}
			target = target.parentElement;
			depth++;
		}
	};

	// Initialisation
	const initializeHaptic = () => {
		document.addEventListener("touchstart", handleTouch, { passive: true });
		console.log("Haptic: Event listener added");

		// Test initial avec délai
		setTimeout(() => {
			console.log("Haptic: Running initial test...");
			vibrate([50]);
		}, 1000);
	};

	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initializeHaptic);
	} else {
		initializeHaptic();
	}

	// API publique avec information sur le support
	const hapticAPI = {
		vibrate: (type = "light") => {
			if (typeof type === "string") {
				return vibrate(patterns[type] || patterns.light);
			} else if (Array.isArray(type) || typeof type === "number") {
				return vibrate(type);
			}
			return vibrate(patterns.light);
		},

		test: () => vibrate([100, 50, 100]),

		patterns,

		// Informations sur le support
		isSupported: () => {
			if (isIOS() && isSafari()) return "vibrate" in navigator;
			if (isIOS() && isChrome()) return false;
			if (isAndroid()) return "vibrate" in navigator;
			return false;
		},

		getDeviceInfo: () => ({
			isIOS: isIOS(),
			isSafari: isSafari(),
			isChrome: isChrome(),
			isAndroid: isAndroid(),
			hasVibrate: "vibrate" in navigator,
			recommendation:
				isIOS() && isChrome()
					? "Use Safari for vibration support"
					: "Supported",
		}),

		stop: () => {
			try {
				return navigator.vibrate && navigator.vibrate(0);
			} catch (error) {
				return false;
			}
		},
	};

	return {
		provide: {
			haptic: hapticAPI,
		},
	};
});
