<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";

const props = defineProps({
	tabs: {
		type: Array,
		required: true,
		// Each tab should have { id: string, label: string }
	},
	initialTab: {
		type: String,
		default: null,
	},
});

const emit = defineEmits(["tab-change"]);

const activeTabId = ref(
	props.initialTab || (props.tabs.length > 0 ? props.tabs[0].id : null)
);
const tabRefs = ref({});
const indicatorWidth = ref(0);
const indicatorLeft = ref(0);

const updateIndicatorPosition = () => {
	const activeTabRef = tabRefs.value[activeTabId.value];
	if (activeTabRef) {
		indicatorWidth.value = activeTabRef.offsetWidth;
		indicatorLeft.value = activeTabRef.offsetLeft;
	}
};

const setActiveTab = (tabId) => {
	activeTabId.value = tabId;
	emit("tab-change", tabId);
};

watch(activeTabId, () => {
	nextTick(() => {
		updateIndicatorPosition();
	});
});

onMounted(() => {
	nextTick(() => {
		updateIndicatorPosition();
		window.addEventListener("resize", updateIndicatorPosition);
	});
});

onUnmounted(() => {
	window.removeEventListener("resize", updateIndicatorPosition);
});
</script>

<template>
	<div class="relative inline-flex bg-black rounded-full shadow-md p-1.5">
		<!-- Sliding indicator -->
		<div
			class="absolute shadow-sm bg-white rounded-full transition-all duration-300 ease-in-out z-0"
			:style="{
				left: indicatorLeft + 'px',
				width: indicatorWidth + 'px',
				top: '6px',
				bottom: '6px',
			}"></div>

		<!-- Buttons -->
		<button
			v-for="tab in tabs"
			:key="tab.id"
			:ref="
				(el) => {
					if (el) tabRefs[tab.id] = el;
				}
			"
			@click="setActiveTab(tab.id)"
			class="relative z-10 rounded-full px-6 py-3 text-base md:text-lg font-apercuMedium transition-all duration-200"
			:class="
				activeTabId === tab.id
					? 'text-black'
					: 'text-white hover:text-gray-200 active:scale-95'
			"
			:aria-label="`Voir ${tab.label}`">
			{{ tab.label }}
		</button>
	</div>
</template>
