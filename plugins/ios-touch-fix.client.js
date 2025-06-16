export default defineNuxtPlugin(() => {
	// Vérification côté client uniquement
	if (!import.meta.client) return;

	// Détection iOS plus précise et performante
	const isIOSDevice = (() => {
		const ua = navigator.userAgent;
		// Exclure macOS (détecté comme iPad depuis Safari 13+)
		if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) {
			// Probable iPad avec trackpad/souris externe
			return false;
		}
		// Vérifier les vrais appareils iOS tactiles
		return /iPad|iPhone|iPod/.test(ua) && !window.MSStream;
	})();

	if (!isIOSDevice) return;

	// Optimisation : une seule manipulation DOM
	const initIOSOptimizations = () => {
		// Cursor pointer pour améliorer la réactivité tactile
		document.documentElement.style.cursor = "pointer";

		// Event listener léger pour forcer l'activation des pseudo-classes :hover
		// Utilise une fonction nommée pour éviter les fuites mémoire
		const touchHandler = () => {};

		document.addEventListener("touchstart", touchHandler, {
			passive: true,
			once: false,
		});

		// Optimisation CSS via une classe plutôt que du style inline
		document.documentElement.classList.add("ios-device");
	};

	// Exécution différée pour éviter de bloquer le rendu initial
	if (document.readyState === "loading") {
		document.addEventListener("DOMContentLoaded", initIOSOptimizations, {
			once: true,
		});
	} else {
		// DOM déjà prêt
		initIOSOptimizations();
	}
});
