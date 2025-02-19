export class SmoothScroll {
	constructor(options = {}) {
		this.options = {
			wrapperSelector: ".smooth-scroll-wrapper",
			contentSelector: "section",
			scrollSpeed: 0.05,
			ease: 0.075,
			...options,
		};

		// DOM References
		this.wrapper = null;
		this.content = null;

		// State
		this.scrollPosition = 0;
		this.targetScrollPosition = 0;
		this.resizeObserver = null;
		this.rafId = null;

		// Bind methods
		this.animate = this.animate.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.init = this.init.bind(this);
	}

	init() {
		// Reset DOM elements
		this.wrapper = document.querySelector(this.options.wrapperSelector);
		this.content = document.querySelector(this.options.contentSelector);

		if (!this.wrapper || !this.content) {
			console.warn("SmoothScroll: Required elements not found");
			return false;
		}

		// Clean up old observer if exists
		if (this.resizeObserver) {
			this.resizeObserver.disconnect();
		}

		this.resizeObserver = new ResizeObserver(this.handleResize);
		this.resizeObserver.observe(this.wrapper);

		// Reset positions
		this.targetScrollPosition = window.scrollY;
		this.scrollPosition = this.targetScrollPosition;

		// Start animation
		if (this.rafId) {
			cancelAnimationFrame(this.rafId);
		}
		this.rafId = requestAnimationFrame(this.animate);

		// Ensure scroll is at top of page
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

		this.scrollPosition = this.lerp(
			this.scrollPosition,
			this.targetScrollPosition,
			this.options.scrollSpeed
		);

		this.wrapper.style.transform = `translate3d(0, ${-this
			.scrollPosition}px, 0)`;
		this.content.style.transform = `translate3d(0, 0, 0)`;

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

		// Function to initialize smooth scroll
		const initializeSmoothScroll = () => {
			if (!smoothScroll) {
				smoothScroll = new SmoothScroll();
			}
			setTimeout(() => {
				smoothScroll.destroy(); // Clean up first
				const initialized = smoothScroll.init(); // Reinitialize
				if (!initialized) {
					// Retry once if initialization fails
					setTimeout(() => {
						smoothScroll.init();
					}, 100);
				}
			}, 50);
		};

		// Initial initialization
		nuxtApp.hook("app:mounted", () => {
			initializeSmoothScroll();
		});

		// Handle route changes
		router.afterEach((to, from) => {
			if (to.path !== from.path) {
				initializeSmoothScroll();
			}
		});

		// Cleanup on close
		nuxtApp.hook("app:beforeDestroy", () => {
			if (smoothScroll) {
				smoothScroll.destroy();
				smoothScroll = null;
			}
		});

		nuxtApp.provide("initializeSmoothScroll", initializeSmoothScroll);
	}
});
