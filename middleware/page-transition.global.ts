import { useDarkMode } from "@/composables/useDarkMode";

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (import.meta.client) {
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

		if (isDarkMode.value) {
			path.setAttribute("fill", "var(--color-white)");
		} else {
			path.setAttribute("fill", "var(--color-black)");
		}

		svg.appendChild(path);
		container.appendChild(svg);
		document.body.appendChild(container);

		const animationDuration = 2000;
		const midPoint = animationDuration / 2;

		requestAnimationFrame(() => {
			container.classList.add("wave-enter");
		});

		setTimeout(() => {
			container.classList.add("wave-paused");
		}, midPoint - 50);

		document.documentElement.classList.add("page-transition-leave-to");

		await new Promise((resolve) => setTimeout(resolve, midPoint));

		try {
			await navigateTo(to.fullPath);
		} catch (error) {
			console.error("Navigation error:", error);
		}

		await new Promise((resolve) => setTimeout(resolve, 200));

		requestAnimationFrame(() => {
			container.classList.remove("wave-paused");
			container.classList.remove("wave-enter");
			container.classList.add("wave-leave");
		});

		setTimeout(() => {
			container.remove();
			document.body.classList.remove("page-transitioning");
			document.documentElement.classList.remove("page-transition-leave-to");
		}, animationDuration + 100);
	}
});
