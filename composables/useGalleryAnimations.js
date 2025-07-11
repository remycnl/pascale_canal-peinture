import { ref } from "vue";
import { gsap } from "gsap";

export const useGalleryAnimations = () => {
	const magneticElements = ref([]);
	const magneticHandlers = ref([]);
	const isDesktop = ref(false);

	const animationPool = {
		currentTweens: new Map(),
		leaveTweens: new Map(),
		clickAnimations: new Set(),
	};

	let deviceCheckCache = null;
	let deviceCheckTime = 0;
	const DEVICE_CHECK_CACHE_TIME = 1000;

	const checkIsDesktop = () => {
		if (!import.meta.client) return false;

		const now = Date.now();
		if (
			deviceCheckCache !== null &&
			now - deviceCheckTime < DEVICE_CHECK_CACHE_TIME
		) {
			return deviceCheckCache;
		}

		const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0;
		const isLargeScreen = window.innerWidth >= 1024;

		deviceCheckCache = !hasTouch && isLargeScreen;
		deviceCheckTime = now;

		return deviceCheckCache;
	};

	const setupClickEffect = () => {
		if (!import.meta.client) return;

		magneticElements.value.forEach((element) => {
			if (!element || element._clickHandler) return;

			const pointerDownHandler = (e) => {
				if (animationPool.clickAnimations.has(element)) return;
				animationPool.clickAnimations.add(element);

				gsap.killTweensOf(element, "scale");

				const tl = gsap.timeline({
					onComplete: () => {
						animationPool.clickAnimations.delete(element);
					},
				});

				tl.to(element, {
					scale: 0.97,
					duration: 0.2,
					ease: "power2.out",
				}).to(element, {
					scale: 1,
					duration: 0.8,
					ease: "elastic.out(1, 0.25)",
				});
			};

			element.addEventListener("pointerdown", pointerDownHandler, {
				passive: false,
				capture: false,
			});
			element._clickHandler = pointerDownHandler;
		});
	};

	const setupMagneticEffect = () => {
		if (!import.meta.client) return;

		isDesktop.value = checkIsDesktop();
		setupClickEffect();

		if (!isDesktop.value) return;

		cleanupMagneticEffect();

		magneticElements.value.forEach((element) => {
			if (!element) return;

			let boundingRect = element.getBoundingClientRect();
			let rafId = null;
			let resizeRafId = null;
			let lastMoveTime = 0;

			let isHovering = false;

			const updateBoundingRect = () => {
				if (rafId) return;
				rafId = requestAnimationFrame(() => {
					boundingRect = element.getBoundingClientRect();
					rafId = null;
				});
			};

			const resizeHandler = () => {
				if (resizeRafId) return;
				resizeRafId = requestAnimationFrame(() => {
					updateBoundingRect();
					resizeRafId = null;
				});
			};

			const mouseEnterHandler = () => {
				isHovering = true;

				const currentTween = animationPool.currentTweens.get(element);
				const leaveTween = animationPool.leaveTweens.get(element);

				if (leaveTween) {
					leaveTween.kill();
					animationPool.leaveTweens.delete(element);
				}
				if (currentTween) {
					currentTween.kill();
					animationPool.currentTweens.delete(element);
				}

				gsap.killTweensOf(element, "x,y");
				gsap.set(element, { x: 0, y: 0 });
				boundingRect = element.getBoundingClientRect();
			};

			const mouseMoveHandler = (e) => {
				if (!isHovering) return;

				const now = performance.now();
				if (now - lastMoveTime < 16) return;
				lastMoveTime = now;

				const centerX = boundingRect.width / 2;
				const centerY = boundingRect.height / 2;
				const moveX = (e.clientX - boundingRect.left - centerX) * 0.15;
				const moveY = (e.clientY - boundingRect.top - centerY) * 0.15;

				const currentTween = animationPool.currentTweens.get(element);
				if (currentTween) currentTween.kill();

				const newTween = gsap.to(element, {
					x: moveX,
					y: moveY,
					duration: 1.2,
					ease: "power2.out",
					overwrite: "auto",
				});

				animationPool.currentTweens.set(element, newTween);
			};

			const mouseLeaveHandler = () => {
				isHovering = false;

				const currentTween = animationPool.currentTweens.get(element);
				if (currentTween) {
					currentTween.kill();
					animationPool.currentTweens.delete(element);
				}

				const leaveTween = gsap.to(element, {
					x: 0,
					y: 0,
					duration: 1.6,
					ease: "elastic.out(1, 0.3)",
					overwrite: "auto",
				});

				animationPool.leaveTweens.set(element, leaveTween);
			};

			element.addEventListener("mouseenter", mouseEnterHandler, {
				passive: true,
			});
			element.addEventListener("mousemove", mouseMoveHandler, {
				passive: true,
			});
			element.addEventListener("mouseleave", mouseLeaveHandler, {
				passive: true,
			});

			window.addEventListener("resize", resizeHandler, { passive: true });
			window.addEventListener("scroll", updateBoundingRect, { passive: true });

			magneticHandlers.value.push({
				element,
				mouseenter: mouseEnterHandler,
				mousemove: mouseMoveHandler,
				mouseleave: mouseLeaveHandler,
				resizeHandler,
				updateBoundingRect,
				rafId,
				resizeRafId,
			});

			gsap.set(element, { x: 0, y: 0, scale: 1 });
		});
	};

	const cleanupMagneticEffect = () => {
		const removeListeners = [];

		magneticHandlers.value.forEach(
			({
				element,
				mouseenter,
				mousemove,
				mouseleave,
				resizeHandler,
				updateBoundingRect,
				rafId,
				resizeRafId,
			}) => {
				if (element) {
					removeListeners.push(() => {
						if (mouseenter)
							element.removeEventListener("mouseenter", mouseenter);
						if (mousemove) element.removeEventListener("mousemove", mousemove);
						if (mouseleave)
							element.removeEventListener("mouseleave", mouseleave);

						if (resizeHandler)
							window.removeEventListener("resize", resizeHandler);
						if (updateBoundingRect)
							window.removeEventListener("scroll", updateBoundingRect);

						if (rafId) cancelAnimationFrame(rafId);
						if (resizeRafId) cancelAnimationFrame(resizeRafId);
					});

					const currentTween = animationPool.currentTweens.get(element);
					const leaveTween = animationPool.leaveTweens.get(element);

					if (currentTween) {
						currentTween.kill();
						animationPool.currentTweens.delete(element);
					}
					if (leaveTween) {
						leaveTween.kill();
						animationPool.leaveTweens.delete(element);
					}

					animationPool.clickAnimations.delete(element);

					gsap.killTweensOf(element, "x,y");
					gsap.set(element, { x: 0, y: 0 });
				}
			}
		);

		removeListeners.forEach((fn) => fn());
		magneticHandlers.value = [];
	};

	const cleanupClickEffect = () => {
		magneticElements.value.forEach((element) => {
			if (element && element._clickHandler) {
				element.removeEventListener("pointerdown", element._clickHandler);
				delete element._clickHandler;
				animationPool.clickAnimations.delete(element);
			}
		});
	};

	let detectionTimeout = null;
	const handleDesktopDetection = () => {
		if (detectionTimeout) clearTimeout(detectionTimeout);

		detectionTimeout = setTimeout(() => {
			const wasDesktop = isDesktop.value;
			isDesktop.value = checkIsDesktop();

			if (wasDesktop !== isDesktop.value) {
				if (isDesktop.value) {
					setupMagneticEffect();
				} else {
					cleanupMagneticEffect();
				}
			}
		}, 100);
	};

	const cleanup = () => {
		cleanupClickEffect();
		cleanupMagneticEffect();

		animationPool.currentTweens.clear();
		animationPool.leaveTweens.clear();
		animationPool.clickAnimations.clear();

		deviceCheckCache = null;
		deviceCheckTime = 0;

		if (detectionTimeout) {
			clearTimeout(detectionTimeout);
			detectionTimeout = null;
		}
	};

	return {
		magneticElements,
		isDesktop,

		setupMagneticEffect,
		cleanupMagneticEffect,
		setupClickEffect,
		cleanupClickEffect,
		handleDesktopDetection,
		checkIsDesktop,
		cleanup,
	};
};
