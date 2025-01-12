// plugins/smooth-scroll.client.js
export class SmoothScroll {
	constructor(options = {}) {
		this.options = {
			wrapperSelector: ".smooth-scroll-wrapper",
			contentSelector: "section",
			scrollSpeed: 0.05,
			skewSpeed: 0.5,
			skewReducer: 3,
			ease: 0.075,
			...options,
		};

		// Références DOM
		this.wrapper = null;
		this.content = null;

		// État
		this.scrollPosition = 0;
		this.targetScrollPosition = 0;
		this.lastScrollTop = 0;
		this.currentSkew = 0;
		this.targetSkew = 0;
		this.resizeObserver = null;
		this.rafId = null;
		this.isScrolling = false;

		// Bind des méthodes
		this.animate = this.animate.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.init = this.init.bind(this);
	}

	init() {
		// Réinitialiser les éléments DOM
		this.wrapper = document.querySelector(this.options.wrapperSelector);
		this.content = document.querySelector(this.options.contentSelector);

		if (!this.wrapper || !this.content) {
			console.warn("SmoothScroll: Required elements not found");
			return false;
		}

		// Nettoyer l'ancien observer si existe
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}

		this.resizeObserver = new ResizeObserver(this.handleResize);
		this.resizeObserver.observe(this.wrapper);

		// Réinitialiser les positions
		this.targetScrollPosition = window.scrollY;
		this.scrollPosition = this.targetScrollPosition;
		this.lastScrollTop = this.targetScrollPosition;
		this.currentSkew = 0;
		this.targetSkew = 0;

		// Démarrer l'animation
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
		}
		this.rafId = requestAnimationFrame(this.animate);

		// S'assurer que le scroll est en haut de la page
		window.scrollTo(0, 0);

		return true;
	}

	handleResize(entries) {
		for (const entry of entries) {
			document.body.style.height = `${Math.floor(entry.contentRect.height)}px`;
		}
	}

	lerp(start, end, factor) {
		return (1 - factor) * start + factor * end;
	}

	animate() {
		if (!this.wrapper || !this.content) return;

		this.targetScrollPosition = window.scrollY;

		const scrollDelta = this.targetScrollPosition - this.lastScrollTop;
		this.targetSkew =
			(scrollDelta / this.options.skewReducer) * this.options.skewSpeed;

		this.scrollPosition = this.lerp(
			this.scrollPosition,
			this.targetScrollPosition,
			this.options.scrollSpeed
		);

		this.currentSkew = this.lerp(
			this.currentSkew,
			this.targetSkew,
			this.options.ease
		);

		if (Math.abs(scrollDelta) < 0.1) {
			this.currentSkew = this.lerp(this.currentSkew, 0, 0.1);
		}

		this.wrapper.style.transform = `translate3d(0, ${-this
			.scrollPosition}px, 0)`;
		this.content.style.transform = `
		perspective(1000px)
		translate3d(0, 0, 0)
		skewY(${this.currentSkew}deg)
	  `;

		this.lastScrollTop = this.targetScrollPosition;
		this.rafId = requestAnimationFrame(this.animate);
	}

	destroy() {
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
			this.rafId = null;
		}

		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
			this.resizeObserver = null;
		}

		if (this.wrapper) {
			this.wrapper.style.transform = "";
			this.wrapper = null;
		}
		if (this.content) {
			this.content.style.transform = "";
			this.content = null;
		}
		document.body.style.height = "";
	}
}

export default defineNuxtPlugin((nuxtApp) => {
	if (import.meta.client) {
		const router = useRouter();
		let smoothScroll = null;

		// Fonction pour initialiser le smooth scroll
		const initializeSmoothScroll = () => {
			if (!smoothScroll) {
				smoothScroll = new SmoothScroll();
			}
			// On attend un petit moment que le DOM soit complètement mis à jour
			setTimeout(() => {
				smoothScroll.destroy(); // On nettoie d'abord
				const initialized = smoothScroll.init(); // On réinitialise
				if (!initialized) {
					// Si l'initialisation échoue, on réessaie une fois
					setTimeout(() => {
						smoothScroll.init();
					}, 100);
				}
			}, 50);
		};

		// Initialisation initiale
		nuxtApp.hook("app:mounted", () => {
			initializeSmoothScroll();
		});

		// Gestion des changements de route
		router.afterEach((to, from) => {
			if (to.path !== from.path) {
				initializeSmoothScroll();
			}
		});

		// Nettoyage à la fermeture
		nuxtApp.hook("app:beforeDestroy", () => {
			if (smoothScroll) {
				smoothScroll.destroy();
				smoothScroll = null;
			}
		});

		nuxtApp.provide('initializeSmoothScroll', initializeSmoothScroll);
	}
});
