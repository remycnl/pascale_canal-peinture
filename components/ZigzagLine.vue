<script setup>
import {
	ref,
	computed,
	onMounted,
	onBeforeUnmount,
	nextTick,
	watch,
} from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

const props = defineProps({
	// (en %)
	controlPoints: {
		type: Array,
		default: () => [
			[150, -10],
			[70, 10],
			[85, 20],
			[15, 37],
			[70, 57],
			[10, 80],
			[20, 88],
			[-50, 107],
		],
	},
	lineColor: {
		type: String,
		default: "var(--color-yellow)",
	},
	lineWidth: {
		type: Number,
		default: 15,
	},
	sensitivity: {
		type: Number,
		default: 1.1,
	},
	offset: {
		type: Number,
		default: 0,
	},
	desktopMinWidth: {
		type: Number,
		default: 1024,
	},
});

const zigzagContainer = ref(null);
const path = ref(null);
const svgWidth = ref(100);
const totalHeight = ref(100);
const dashLength = ref(0);
const dashOffset = ref(0);
const pathLength = ref(0);
const targetOffset = ref(0);
const animationId = ref(null);
const containerTop = ref(0);
const containerHeight = ref(0);
const windowHeight = ref(0);
const windowWidth = ref(0);
const calculatedPoints = ref([]);
const isInitialized = ref(false);
const isVisible = ref(false);
const isDesktop = ref(false);
let observer = null;

const pathData = computed(() => {
	if (!calculatedPoints.value || calculatedPoints.value.length < 2) {
		return "";
	}

	let path = `M ${calculatedPoints.value[0][0]} ${calculatedPoints.value[0][1]}`;

	for (let i = 1; i < calculatedPoints.value.length; i++) {
		const prevPoint = calculatedPoints.value[i - 1];
		const currentPoint = calculatedPoints.value[i];

		const cpX1 = prevPoint[0];
		const cpY1 = prevPoint[1] + (currentPoint[1] - prevPoint[1]) / 3;

		const cpX2 = currentPoint[0];
		const cpY2 = currentPoint[1] - (currentPoint[1] - prevPoint[1]) / 3;

		path += ` C ${cpX1},${cpY1} ${cpX2},${cpY2} ${currentPoint[0]},${currentPoint[1]}`;
	}

	return path;
});

const checkIfDesktop = () => {
	isDesktop.value = window.innerWidth >= props.desktopMinWidth;
};

const initializeAnimation = () => {
	checkIfDesktop();

	if (!isDesktop.value) {
		return;
	}

	nextTick(() => {
		calculatePointsFromPercentage();

		setTimeout(() => {
			if (path.value) {
				pathLength.value = path.value.getTotalLength() || 1000;
				dashLength.value = pathLength.value;
				dashOffset.value = pathLength.value;

				isInitialized.value = true;

				setTimeout(checkVisibility, 100);
			}
		}, 100);
	});
};

const calculatePointsFromPercentage = () => {
	const width = svgWidth.value || 100;
	const height = totalHeight.value || 100;

	calculatedPoints.value = props.controlPoints.map((point) => [
		(point[0] / 100) * width,
		(point[1] / 100) * height,
	]);
};

const handleDimensionsChange = () => {
	const wasDesktop = isDesktop.value;
	checkIfDesktop();

	if (!wasDesktop && isDesktop.value) {
		resetAnimation();
		return;
	}

	if (wasDesktop && !isDesktop.value) {
		isInitialized.value = false;
		isVisible.value = false;
		return;
	}

	if (!isDesktop.value) {
		return;
	}

	updateDimensions();
	calculatePointsFromPercentage();

	setTimeout(() => {
		if (path.value && isInitialized.value) {
			const newPathLength = path.value.getTotalLength() || pathLength.value;

			const progress = 1 - dashOffset.value / pathLength.value;

			pathLength.value = newPathLength;
			dashLength.value = newPathLength;
			dashOffset.value = newPathLength - progress * newPathLength;

			checkVisibility();
		}
	}, 50);
};

const updateDimensions = () => {
	if (zigzagContainer.value) {
		const rect = zigzagContainer.value.getBoundingClientRect();
		containerTop.value = rect.top + window.scrollY;
		containerHeight.value = rect.height;

		svgWidth.value = Math.max(100, rect.width);
		totalHeight.value = Math.max(100, rect.height);
	}

	windowHeight.value = window.innerHeight;
	windowWidth.value = window.innerWidth;
};

const checkVisibility = () => {
	if (!isDesktop.value || !isInitialized.value || !zigzagContainer.value)
		return;

	updateDimensions();

	const scrollY = window.scrollY || document.documentElement.scrollTop;
	const componentTop =
		containerTop.value - scrollY - props.offset * windowHeight.value;
	const componentBottom = componentTop + containerHeight.value;

	isVisible.value = !(componentBottom < 0 || componentTop > windowHeight.value);

	if (isVisible.value) {
		handleScroll();
	} else {
		dashOffset.value = pathLength.value;
	}
};

const handleScroll = () => {
	if (!isDesktop.value || !isInitialized.value) return;

	if (animationId.value) {
		cancelAnimationFrame(animationId.value);
	}

	const scrollY = window.scrollY || document.documentElement.scrollTop;

	const windowCenter = windowHeight.value / 2;
	const componentTop =
		containerTop.value - scrollY - props.offset * windowHeight.value;
	const componentBottom = componentTop + containerHeight.value;

	let progress = 0;

	if (componentBottom <= windowCenter) {
		progress = 1;
	} else if (componentTop >= windowCenter) {
		progress = 0;
	} else {
		progress = (windowCenter - componentTop) / containerHeight.value;
	}

	progress = Math.max(0, Math.min(1, progress));
	progress = Math.pow(progress, 1 / props.sensitivity);

	targetOffset.value = pathLength.value - progress * pathLength.value;

	animateOffset();
};

const animateOffset = () => {
	const currentOffset = dashOffset.value;
	const targetOffsetValue = targetOffset.value;

	if (Math.abs(currentOffset - targetOffsetValue) < 0.5) {
		dashOffset.value = targetOffsetValue;
		return;
	}

	const easing = 0.1;
	const newOffset =
		currentOffset + (targetOffsetValue - currentOffset) * easing;

	dashOffset.value = newOffset;

	animationId.value = requestAnimationFrame(animateOffset);
};

const resetAnimation = () => {
	isInitialized.value = false;
	isVisible.value = false;
	dashOffset.value = pathLength.value;

	setTimeout(() => {
		checkIfDesktop();

		if (isDesktop.value) {
			updateDimensions();
			initializeAnimation();
		}
	}, 300);
};

watch(
	() => route.path,
	(newPath, oldPath) => {
		if (newPath !== oldPath) {
			resetAnimation();
		}
	},
	{ immediate: false }
);

const setupIntersectionObserver = () => {
	if (
		!zigzagContainer.value ||
		typeof IntersectionObserver === "undefined" ||
		!isDesktop.value
	)
		return;

	observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					if (isInitialized.value) {
						isVisible.value = true;
						handleScroll();
					}
				} else {
					isVisible.value = false;
				}
			});
		},
		{ threshold: 0.1 }
	);

	observer.observe(zigzagContainer.value);
};

onMounted(() => {
	checkIfDesktop();
	updateDimensions();

	if (isDesktop.value) {
		setTimeout(() => {
			initializeAnimation();
			setupIntersectionObserver();
		}, 200);
	}

	window.addEventListener("scroll", handleScroll);
	window.addEventListener("resize", handleDimensionsChange);

	window.addEventListener("nuxt:page:finish", () => {
		setTimeout(resetAnimation, 100);
	});
});

onBeforeUnmount(() => {
	window.removeEventListener("scroll", handleScroll);
	window.removeEventListener("resize", handleDimensionsChange);
	window.removeEventListener("nuxt:page:finish", resetAnimation);

	if (animationId.value) {
		cancelAnimationFrame(animationId.value);
	}

	if (observer) {
		observer.disconnect();
	}
});
</script>

<template>
	<section
		ref="zigzagContainer"
		class="z-10 relative w-full overflow-visible"
		aria-label="Content with animated path">
		<svg
			v-if="isDesktop"
			class="absolute top-0 left-0 pointer-events-none w-full h-full overflow-visible"
			:viewBox="`0 0 ${svgWidth} ${totalHeight}`"
			xmlns="http://www.w3.org/2000/svg"
			preserveAspectRatio="none"
			aria-hidden="true"
			role="presentation">
			<path
				ref="path"
				:d="pathData"
				:stroke="lineColor"
				:stroke-width="lineWidth"
				fill="none"
				:stroke-dasharray="dashLength"
				:stroke-dashoffset="dashOffset"
				:stroke-linecap="'round'"
				:stroke-linejoin="'round'" />
		</svg>
		<div
			class="relative mt-20 lg:-mt-30 flex flex-col gap-20 md:gap-50 lg:gap-140">
			<slot></slot>
		</div>
	</section>
</template>
