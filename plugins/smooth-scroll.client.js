import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { gsap } from "gsap";

export default defineNuxtPlugin((nuxtApp) => {
	if (!(import.meta.client && window.innerWidth > 1024)) return {};

	gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

	let smoother = null;
	let resizeTimer = null;
	let initializationInProgress = false;

	const eventHandlers = {
		waveStarted: () => {
			if (smoother) smoother.paused(true);
		},
		waveAlmostComplete: () => {
			if (window.innerWidth > 1024) {
				initializeSmoothScroll(true);
			}
		},
		waveComplete: () => {
			if (smoother) {
				smoother.paused(false);
				smoother.scrollTrigger.refresh(true);
			}
		},
		resize: () => {
			clearTimeout(resizeTimer);
			resizeTimer = setTimeout(() => {
				const isDesktop = window.innerWidth > 1024;

				if (isDesktop && !smoother) {
					initializeSmoothScroll();
				} else if (!isDesktop && smoother) {
					smoother.kill();
					smoother = null;
				} else if (isDesktop && smoother) {
					smoother.scrollTrigger.refresh();
				}
			}, 200);
		},
	};

	const preloadImages = () => {
		const images = document.querySelectorAll("img");
		const totalImages = images.length;

		if (totalImages === 0) {
			return Promise.resolve();
		}

		return new Promise((resolve) => {
			let loadedCount = 0;
			const loadHandler = () => {
				loadedCount++;
				if (loadedCount === totalImages) {
					if (smoother) smoother.scrollTrigger.refresh();
					resolve();
				}
			};

			if (Array.from(images).every((img) => img.complete)) {
				resolve();
				return;
			}

			images.forEach((img) => {
				if (img.complete) {
					loadedCount++;
				} else {
					img.addEventListener("load", loadHandler, { once: true });
					// Add error handler as well
					img.addEventListener("error", loadHandler, { once: true });
				}
			});

			setTimeout(resolve, 500);
		});
	};

	const setupInverseParallax = () => {
		ScrollTrigger.getAll()
			.filter((st) => st.vars?.id?.includes("inverse-parallax"))
			.forEach((st) => st.kill());

		const inverseElements = document.querySelectorAll("[data-inverse-speed]");

		inverseElements.forEach((element, index) => {
			const speed = parseFloat(element.getAttribute("data-inverse-speed"));

			if (speed && !isNaN(speed)) {
				gsap.to(element, {
					y: () => -speed * window.innerHeight * 0.5,
					ease: "none",
					scrollTrigger: {
						id: `inverse-parallax-${index}`,
						trigger: element,
						start: "top bottom",
						end: "bottom top",
						scrub: true,
						invalidateOnRefresh: true,
					},
				});
			}
		});
	};

	const initializeSmoothScroll = async (force = false) => {
		if (initializationInProgress && !force) return;
		initializationInProgress = true;

		if (smoother) {
			smoother.kill();
			smoother = null;
		}

		ScrollTrigger.getAll().forEach((st) => st.kill());

		const wrapper = document.querySelector("#smooth-wrapper");
		const content = document.querySelector("#smooth-content");

		if (!wrapper || !content) {
			initializationInProgress = false;
			return;
		}

		await preloadImages();

		smoother = ScrollSmoother.create({
			wrapper: "#smooth-wrapper",
			content: "#smooth-content",
			smooth: 1.5,
			effects: true,
			smoothTouch: 0.1,
			normalizeScroll: {
				allowNestedScroll: true,
			},
			ignoreMobileResize: true,
		});

		setupInverseParallax();

		requestAnimationFrame(() => {
			if (smoother) smoother.scrollTrigger.refresh();
			initializationInProgress = false;
		});
	};

	nuxtApp.hook("page:start", () => {
		if (window.innerWidth > 1024 && smoother) {
			smoother.kill();
			smoother = null;
		}
	});

	nuxtApp.hook("page:finish", () => {
		if (window.innerWidth > 1024) {
			setTimeout(initializeSmoothScroll, 100);
		}
	});

	nuxtApp.hook("app:mounted", () => {
		setTimeout(initializeSmoothScroll, 100);
	});

	if (import.meta.client) {
		window.addEventListener(
			"wave-transition-started",
			eventHandlers.waveStarted
		);
		window.addEventListener(
			"wave-transition-almost-complete",
			eventHandlers.waveAlmostComplete
		);
		window.addEventListener(
			"wave-transition-complete",
			eventHandlers.waveComplete
		);
		window.addEventListener("resize", eventHandlers.resize, { passive: true });
	}

	const scrollSmootherAPI = {
		init: () => {
			if (smoother) {
				smoother.scrollTrigger.refresh();
			} else {
				initializeSmoothScroll();
			}
		},
		scrollTo: (target, smooth = true) => {
			if (smoother) {
				smoother.scrollTo(target, smooth);
			}
		},
		refresh: () => {
			if (smoother) {
				smoother.scrollTrigger.refresh();
			}
		},
		applyInverseParallax: (target, speed) => {
			if (!smoother) return;

			const elements =
				typeof target === "string"
					? document.querySelectorAll(target)
					: [target];

			elements.forEach((element, index) => {
				gsap.to(element, {
					y: () => -speed * window.innerHeight * 0.5,
					ease: "none",
					scrollTrigger: {
						id: `manually-inverse-parallax-${index}`,
						trigger: element,
						start: "top bottom",
						end: "bottom top",
						scrub: true,
						invalidateOnRefresh: true,
					},
				});
			});
		},
		refreshAfterImagesLoaded: () => {
			if (smoother) {
				preloadImages().then(() => {
					smoother.scrollTrigger.refresh();
				});
			}
		},
		pause: () => smoother?.paused(true),
		resume: () => smoother?.paused(false),
	};

	const cleanup = () => {
		clearTimeout(resizeTimer);
		if (smoother) {
			smoother.kill();
			smoother = null;
		}
		ScrollTrigger.getAll().forEach((st) => st.kill());

		if (import.meta.client) {
			window.removeEventListener(
				"wave-transition-started",
				eventHandlers.waveStarted
			);
			window.removeEventListener(
				"wave-transition-almost-complete",
				eventHandlers.waveAlmostComplete
			);
			window.removeEventListener(
				"wave-transition-complete",
				eventHandlers.waveComplete
			);
			window.removeEventListener("resize", eventHandlers.resize);
		}
	};

	return {
		provide: {
			scrollSmoother: scrollSmootherAPI,
		},
		cleanup,
	};
});
