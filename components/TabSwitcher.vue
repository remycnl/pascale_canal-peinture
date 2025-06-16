<script setup>
import { ref, watch, onMounted, onUnmounted, nextTick } from "vue";

const props = defineProps({
	tabs: {
		type: Array,
		required: true,
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

watch(
	() => props.initialTab,
	(newTab) => {
		if (newTab && newTab !== activeTabId.value) {
			activeTabId.value = newTab;
		}
	},
	{ immediate: true }
);

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
	<nav
		class="relative inline-flex bg-black rounded-full shadow-md p-1.5"
		aria-label="Content tabs">
		<!-- Sliding indicator -->
		<div
			class="absolute shadow-sm bg-white rounded-full transition-all duration-300 ease-in-out z-0"
			:style="{
				left: indicatorLeft + 'px',
				width: indicatorWidth + 'px',
				top: '6px',
				bottom: '6px',
			}"
			aria-hidden="true"></div>

		<!-- Buttons -->
		<div role="tablist" class="flex">
			<button
				v-for="tab in tabs"
				:key="tab.id"
				:ref="
					(el) => {
						if (el) tabRefs[tab.id] = el;
					}
				"
				@click="setActiveTab(tab.id)"
				class="relative z-10 rounded-full px-6 py-3 text-sm sm:text-base md:text-lg font-apercuMedium transition-all duration-200 cursor-pointer"
				:class="
					activeTabId === tab.id
						? 'text-black'
						: 'text-white hover:text-gray-200 active:scale-95'
				"
				:aria-selected="activeTabId === tab.id"
				role="tab"
				:id="`tab-${tab.id}`"
				:aria-controls="`panel-${tab.id}`">
				{{ tab.label }}
			</button>
		</div>
	</nav>
</template>
