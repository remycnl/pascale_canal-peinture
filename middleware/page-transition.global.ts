import { useDarkMode } from "@/composables/useDarkMode";

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (import.meta.client) {
		document.body.classList.add("page-transitioning");
		
		const scrollDuration = 100;
		const scrollHeight = 1000;
		const startPosition = window.scrollY;
		const startTime = performance.now();
		const { isDarkMode } = useDarkMode();
		
		const scrollAnimation = (currentTime: number) => {
			const elapsed = currentTime - startTime;
			const progress = Math.min(elapsed / scrollDuration, 1);

			const easeOutQuad = (t: number) => t * (2 - t);
			const easedProgress = easeOutQuad(progress);

			window.scrollTo(0, startPosition + scrollHeight * easedProgress);

			if (progress < 1) {
				requestAnimationFrame(scrollAnimation);
			}
		};

		requestAnimationFrame(scrollAnimation);
		await new Promise((resolve) => setTimeout(resolve, scrollDuration));

		const container = document.createElement("div");
		container.className = "wave-container";

		const width = window.innerWidth;
		const height = window.innerHeight * 2;

		const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
		svg.classList.add("wave-shape");

		const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
		path.setAttribute(
			"d",
			`M0,0 L0,${height * 0.85} C${width * 0.25},${height * 0.95} ${
				width * 0.75
			},${height * 0.95} ${width},${height * 0.85} L${width},0 C${
				width * 0.75
			},${height * 0.15} ${width * 0.25},${height * 0.15} 0,0 Z`
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

		document.documentElement.classList.add("page-transition-leave-to");

		await new Promise((resolve) => setTimeout(resolve, midPoint));
		await navigateTo(to.fullPath);

		container.classList.remove("wave-enter");
		container.classList.add("wave-leave");

		setTimeout(() => {
			container.remove();
			document.body.classList.remove("page-transitioning");
			document.documentElement.classList.remove("page-transition-leave-to");
		}, animationDuration + 100);
	}
});
