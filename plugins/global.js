export default defineNuxtPlugin(() => {
	if (import.meta.client) {
			initSmoothScroll();
	}
});

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
		this.wrapper = document.querySelector(this.options.wrapperSelector);
		this.content = document.querySelector(this.options.contentSelector);

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

		this.init();
	}

	init() {
		this.resizeObserver = new ResizeObserver(this.handleResize);
		this.resizeObserver.observe(this.wrapper);
		this.targetScrollPosition = window.scrollY;
		this.scrollPosition = this.targetScrollPosition;
		this.rafId = requestAnimationFrame(this.animate);
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
		// Mise à jour de la position cible
		this.targetScrollPosition = window.scrollY;

		// Calcul du skew basé sur la différence de scroll
		const scrollDelta = this.targetScrollPosition - this.lastScrollTop;
		this.targetSkew =
			(scrollDelta / this.options.skewReducer) * this.options.skewSpeed;

		// Application du lerp pour une animation fluide
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

		// Si presque pas de mouvement, force le retour à 0
		if (Math.abs(scrollDelta) < 0.1) {
			this.currentSkew = this.lerp(this.currentSkew, 0, 0.1);
		}

		// Application des transformations
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
		}

		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}

		this.wrapper.style.transform = "";
		this.content.style.transform = "";
		document.body.style.height = "";
	}
}

export function initSmoothScroll(options = {}) {
	const smoothScroll = new SmoothScroll(options);
	return () => smoothScroll.destroy();
}
