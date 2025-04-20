<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, nextTick } from "vue";
import { gsap } from "gsap";

const props = defineProps({
	paintings: {
		type: Array,
		default: () => [],
	},
	container: {
		type: Object,
		default: null,
	},
});

const images = ref([]);
const activeImages = ref(new Set());

const lastPosition = reactive({ x: 0, y: 0 });
const mousePosition = reactive({ x: 0, y: 0 });
let index = 0;
const minDistance = 180;
let needsUpdate = false;
const animationReady = ref(false);
const isDesktop = ref(false);

const checkIfDesktop = () => {
	if (import.meta.client) {
		isDesktop.value = window.innerWidth >= 1024;
	}
};

const setImageStyles = (img) => {
	gsap.set(img, {
		left: "-9999px",
		top: "-9999px",
		scale: 0.8,
		position: "absolute",
		pointerEvents: "none",
		willChange: "transform, opacity",
	});
};

onMounted(() => {
	if (import.meta.client) {
		checkIfDesktop();
		window.addEventListener("resize", checkIfDesktop);

		nextTick(() => {
			images.value = Array.from(document.querySelectorAll(".cursor-picture"));
			images.value.forEach((img) => setImageStyles(img));

			setTimeout(() => {
				animationReady.value = true;

				if (props.container && isDesktop.value) {
					props.container.addEventListener("mousemove", handleMouseMove, {
						passive: true,
					});
				}
				if (isDesktop.value) {
					gsap.ticker.add(updateImagePositions);
				}
			}, 100);
		});
	}
});

onBeforeUnmount(() => {
	if (import.meta.client) {
		window.removeEventListener("resize", checkIfDesktop);
		if (props.container) {
			props.container.removeEventListener("mousemove", handleMouseMove);
		}
		gsap.ticker.remove(updateImagePositions);
		activeImages.value.clear();
	}
});

const handleMouseMove = (e) => {
	if (!animationReady.value || !isDesktop.value) return;

	const rect = props.container.getBoundingClientRect();
	mousePosition.x = e.clientX;
	mousePosition.y = e.clientY - rect.top;
	needsUpdate = true;
};

const updateImagePositions = () => {
	if (
		!needsUpdate ||
		!animationReady.value ||
		!isDesktop.value ||
		images.value.length === 0
	)
		return;
	needsUpdate = false;

	const distance = Math.hypot(
		mousePosition.x - lastPosition.x,
		mousePosition.y - lastPosition.y
	);

	if (distance < minDistance) return;

	lastPosition.x = mousePosition.x;
	lastPosition.y = mousePosition.y;

	if (index >= images.value.length) index = 0;
	const img = images.value[index];

	if (!img || activeImages.value.has(img)) return;

	index++;
	activeImages.value.add(img);

	const imgWidth = img.offsetWidth || img.clientWidth || 100;
	const imgHeight = img.offsetHeight || img.clientHeight || 100;

	gsap.set(img, {
		left: `${mousePosition.x - imgWidth / 2}px`,
		top: `${mousePosition.y - imgHeight / 2}px`,
		scale: 0.8,
		opacity: 0,
	});

	const tl = gsap.timeline();

	tl.to(img, {
		duration: 0.3,
		opacity: 1,
		scale: 1,
		ease: "power2.out",
	})
		.to(img, {
			duration: 0.1,
			opacity: 1,
		})
		.to(img, {
			duration: 0.3,
			opacity: 0,
			scale: 0.8,
			ease: "power2.in",
			onComplete: () => {
				activeImages.value.delete(img);
			},
		});
};
</script>

<template>
	<div>
		<div v-for="painting in paintings" :key="painting.id">
			<NuxtImg
				:src="painting.image"
				:alt="painting.name"
				format="webp"
				quality="50"
				fit="contain"
				provider="cloudinary"
				class="cursor-picture absolute w-70 rounded-2xl select-none"
				@load="(e) => e.target && setImageStyles(e.target)" />
		</div>
	</div>
</template>
