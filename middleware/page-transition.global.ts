import { useDarkMode } from "@/composables/useDarkMode";
import { defineNuxtRouteMiddleware, navigateTo } from "#imports";

declare module "#app" {
	interface NuxtApp {
		$scrollSmoother: {
			refreshFooterAnimations: () => void;
		};
	}
}

const WAVE_CONTAINER_CLASS = "wave-container";
const WAVE_SHAPE_CLASS = "wave-shape";
const ANIMATION_DURATION = 1500;

function createWaveElement(isDark: boolean, isMobile: boolean): HTMLDivElement {
	const container = document.createElement("div");
	container.className = WAVE_CONTAINER_CLASS;

	const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svg.setAttribute("viewBox", "0 0 100 400");
	svg.setAttribute("preserveAspectRatio", "none");
	svg.classList.add(WAVE_SHAPE_CLASS);

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
		isDark ? "var(--color-white)" : "var(--color-black)"
	);

	svg.appendChild(path);
	container.appendChild(svg);
	return container;
}

export default defineNuxtRouteMiddleware(async (to, from) => {
	if (!import.meta.client) return;
	if (to.path === from.path && to.name === from.name) return;

	const { isDarkMode } = useDarkMode();
	const isMobile = window.innerWidth < 768;
	const container = createWaveElement(isDarkMode.value, isMobile);

	document.body.appendChild(container);

	// Animation entrée
	container.classList.add("wave-enter");

	let navigationTimeout: ReturnType<typeof setTimeout> | null = null;
	let leaveTimeout: ReturnType<typeof setTimeout> | null = null;

	try {
		await Promise.all([
			new Promise<void>((resolve) => {
				navigationTimeout = setTimeout(async () => {
					try {
						await navigateTo(to.fullPath);
					} catch (error) {
						console.error("Navigation error:", error);
					}
					resolve();
				}, ANIMATION_DURATION * 0.5);
			}),
			new Promise<void>((resolve) => {
				leaveTimeout = setTimeout(() => {
					container.classList.add("wave-leave");
					setTimeout(() => container.remove(), ANIMATION_DURATION);
					resolve();
				}, ANIMATION_DURATION);
			}),
		]);
	} finally {
		if (navigationTimeout) clearTimeout(navigationTimeout);
		if (leaveTimeout) clearTimeout(leaveTimeout);
	}
});
