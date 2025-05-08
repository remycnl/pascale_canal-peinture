import { useDarkMode } from "@/composables/useDarkMode";
import { defineNuxtRouteMiddleware, navigateTo, useNuxtApp } from "#imports";

declare module "#app" {
	interface NuxtApp {
		$scrollSmoother: {
			refreshFooterAnimations: () => void;
		};
	}
}

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (import.meta.client) {
		const transitionStartedEvent = new CustomEvent("wave-transition-started");
		const transitionAlmostCompleteEvent = new CustomEvent(
			"wave-transition-almost-complete"
		);
		const transitionCompleteEvent = new CustomEvent("wave-transition-complete");

		window.dispatchEvent(transitionStartedEvent);

		document.body.classList.add("page-transitioning");

		const { isDarkMode } = useDarkMode();

		const container = document.createElement("div");
		container.className = "wave-container";
		container.style.width = "100vw";
		container.style.height = "200vh";
		container.style.position = "fixed";
		container.style.top = "0";
		container.style.left = "0";
		container.style.zIndex = "9999";
		container.style.overflow = "hidden";

		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", "0 0 100 400");
		svg.setAttribute("preserveAspectRatio", "none");
		svg.classList.add("wave-shape");
		svg.style.width = "100%";
		svg.style.height = "100%";

		const isMobile = window.innerWidth < 768;
		const curveStrength = isMobile ? 15 : 30;

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute(
			"d",
			`M0,0 L0,340 C25,${340 + curveStrength} 75,${
				340 + curveStrength
			} 100,340 L100,0 C75,${0 + curveStrength} 25,${0 + curveStrength} 0,0 Z`
		);

		path.setAttribute(
			"fill",
			isDarkMode.value ? "var(--color-white)" : "var(--color-black)"
		);

		svg.appendChild(path);
		container.appendChild(svg);
		document.body.appendChild(container);

		const animationDuration = 1500;

		requestAnimationFrame(() => {
			container.classList.add("wave-enter");
		});

		setTimeout(async () => {
			try {
				await navigateTo(to.fullPath);

				setTimeout(() => {
					window.dispatchEvent(transitionAlmostCompleteEvent);
				}, 50);
			} catch (error) {
				console.error("Navigation error:", error);
			}
		}, animationDuration * 0.5);

		await new Promise((resolve) => setTimeout(resolve, animationDuration));

		requestAnimationFrame(() => {
			container.classList.add("wave-leave");
		});

		setTimeout(() => {
			container.remove();
			document.body.classList.remove("page-transitioning");

			window.dispatchEvent(transitionCompleteEvent);

			const nuxtApp = useNuxtApp();
			if (nuxtApp && nuxtApp.$scrollSmoother) {
				setTimeout(() => {
					nuxtApp.$scrollSmoother.refreshFooterAnimations();
				}, 50);
			}
		}, animationDuration);
	}
});
