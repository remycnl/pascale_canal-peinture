<script setup>
import { ref, watch, computed, onMounted, onUnmounted, nextTick } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const props = defineProps({
	allTags: {
		type: Array,
		default: () => [],
	},
	totalCount: {
		type: Number,
		default: 0,
	},
	filteredCount: {
		type: Number,
		default: 0,
	},
});

const skipUrlUpdate = ref(true);

const showOnlyForSale = ref(false);
const selectedTags = ref([]);
const isFiltersOpen = ref(false);
const searchQuery = ref("");

const isMenuVisible = ref(false);
const shouldRenderMenu = ref(false);
const debounceTimer = ref(null);

const loadFiltersFromUrl = () => {
	const query = route.query;

	showOnlyForSale.value = query.forSale === "true";
	selectedTags.value = query.tags ? query.tags.split(",") : [];
	searchQuery.value = query.search || "";
};

const applyFilters = (preservePage = false) => {
	if (skipUrlUpdate.value) return;

	const query = { ...route.query };

	if (!preservePage) {
		delete query.page;
	}

	if (showOnlyForSale.value) {
		query.forSale = "true";
	} else {
		delete query.forSale;
	}

	if (selectedTags.value.length > 0) {
		query.tags = selectedTags.value.join(",");
	} else {
		delete query.tags;
	}

	if (searchQuery.value.trim()) {
		query.search = searchQuery.value.trim();
	} else {
		delete query.search;
	}

	router.push({
		query: query,
	});
};

const toggleFilters = () => {
	if (isFiltersOpen.value) {
		isMenuVisible.value = false;
		isFiltersOpen.value = false;
	} else {
		isFiltersOpen.value = true;
		shouldRenderMenu.value = true;
		setTimeout(() => {
			isMenuVisible.value = true;
		}, 10);
	}
};

const toggleTag = (tagValue) => {
	if (selectedTags.value.includes(tagValue)) {
		selectedTags.value = selectedTags.value.filter((t) => t !== tagValue);
	} else {
		selectedTags.value.push(tagValue);
	}
};

const isTagSelected = (tagValue) => {
	return selectedTags.value.includes(tagValue);
};

const clearFilters = () => {
	showOnlyForSale.value = false;
	selectedTags.value = [];
	searchQuery.value = "";

	applyFilters(false);
};

const activeFiltersCount = computed(() => {
	let count = 0;
	if (showOnlyForSale.value) count++;
	count += selectedTags.value.length;
	if (searchQuery.value.trim()) count++;
	return count;
});

const debounce = (func, delay) => {
	clearTimeout(debounceTimer.value);
	debounceTimer.value = setTimeout(() => {
		func();
	}, delay);
};

watch(showOnlyForSale, () => {
	if (!skipUrlUpdate.value) applyFilters(false);
});

watch(
	selectedTags,
	() => {
		if (!skipUrlUpdate.value) applyFilters(false);
	},
	{ deep: true }
);

watch(searchQuery, () => {
	if (!skipUrlUpdate.value) {
		debounce(() => applyFilters(false), 300);
	}
});

watch(
	() => route.query,
	() => {
		if (route.query !== router.currentRoute.value.query) {
			skipUrlUpdate.value = true;
			loadFiltersFromUrl();
			nextTick(() => {
				skipUrlUpdate.value = false;
				applyFilters(true);
			});
		}
	},
	{ deep: true }
);

onMounted(() => {
	loadFiltersFromUrl();

	nextTick(() => {
		skipUrlUpdate.value = false;
		applyFilters(true);
	});
});

onUnmounted(() => {
	clearTimeout(debounceTimer.value);
});
</script>

<template>
	<div class="w-full z-20 flex flex-col items-end relative">
		<!-- Filter button for all devices -->
		<div class="mt-5 w-full">
			<button
				@click="toggleFilters"
				class="flex items-center justify-between gap-x-4 w-full px-4 py-3 bg-white border border-black rounded-lg shadow-sm hover:bg-gray-100 active:scale-98 transition-all duration-200">
				<span class="font-medium flex items-center">
					<span>Filtrer</span>
					<span
						v-if="activeFiltersCount > 0"
						class="ml-2 bg-yellow text-black text-xs font-bold px-2.5 py-1 rounded-full">
						{{ activeFiltersCount }}
					</span>
				</span>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5 transition-transform duration-300"
					:class="{ 'rotate-180': isFiltersOpen && isMenuVisible }"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M19 9l-7 7-7-7" />
				</svg>
			</button>
		</div>

		<!-- Filter container -->
		<div class="relative w-full">
			<Transition
				name="menu"
				@before-enter="
					(el) => {
						el.style.height = '0';
					}
				"
				@enter="
					(el) => {
						el.style.height = `${el.scrollHeight}px`;
					}
				"
				@after-enter="
					(el) => {
						el.style.height = 'auto';
					}
				"
				@before-leave="
					(el) => {
						el.style.height = `${el.scrollHeight}px`;
					}
				"
				@leave="
					(el) => {
						el.style.height = '0';
					}
				">
				<div
					v-if="shouldRenderMenu || isFiltersOpen"
					v-show="isMenuVisible || isFiltersOpen">
					<div
						class="transition-all mt-4 duration-300 bg-white border border-black rounded-xl shadow-sm overflow-hidden">
						<div class="p-5 lg:p-6">
							<!-- Search -->
							<div class="mb-7">
								<div class="relative">
									<input
										id="search"
										v-model="searchQuery"
										type="text"
										placeholder="Rechercher une œuvre..."
										class="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow focus:border-yellow transition-all duration-200" />
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor">
										<path
											stroke-linecap="round"
											stroke-linejoin="round"
											stroke-width="2"
											d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
									</svg>
								</div>
							</div>

							<!-- À vendre seulement -->
							<div class="mb-7">
								<div
									class="flex items-start w-fit cursor-pointer hover:bg-gray-100 p-2 rounded-md -ml-2"
									@click="showOnlyForSale = !showOnlyForSale">
									<div
										class="cbx flex items-center justify-center w-5 h-5 border border-gray-700 rounded mr-3 transition-colors duration-200"
										:class="showOnlyForSale ? 'bg-yellow' : 'bg-white'"></div>
									<span class="font-medium text-sm">
										Disponibles à la vente uniquement
									</span>
								</div>
							</div>

							<!-- Divider -->
							<div class="w-full h-px bg-gray-200 my-6"></div>

							<!-- Tags -->
							<div>
								<h3 class="font-bold mb-4 text-sm uppercase tracking-wide">
									Catégories
								</h3>
								<div class="flex flex-wrap gap-2.5">
									<button
										v-for="tag in props.allTags"
										:key="tag.value"
										@click="toggleTag(tag.value)"
										class="px-3.5 py-2 rounded-md border text-sm transition-all duration-200 active:scale-95"
										:class="
											isTagSelected(tag.value)
												? 'bg-yellow border-black font-medium'
												: 'bg-white border-gray-300 hover:bg-gray-50 hover:border-gray-400'
										">
										{{ tag.label }}
									</button>
								</div>
							</div>

							<!-- Results count and clear filters -->
							<div class="mt-7 pt-4 border-t border-gray-200">
								<div class="flex items-center justify-between">
									<span class="text-sm text-gray-600">
										{{ filteredCount }}
										<span class="text-gray-500"
											>sur {{ totalCount }} œuvres</span
										>
									</span>
									<button
										@click="clearFilters"
										class="text-sm px-4 py-2 border rounded-lg transition-all duration-200 active:scale-95"
										:class="
											activeFiltersCount === 0
												? 'opacity-40 cursor-not-allowed border-gray-300 text-gray-400'
												: 'border-black hover:bg-black hover:text-white'
										"
										:disabled="activeFiltersCount === 0">
										Effacer les filtres
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</Transition>
		</div>
	</div>
</template>

<style scoped>
.menu-enter-active,
.menu-leave-active {
	transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
	overflow: hidden;
}

.menu-enter-from,
.menu-leave-to {
	opacity: 0;
	transform: translateY(-8px);
}

.menu-enter-to,
.menu-leave-from {
	opacity: 1;
	transform: translateY(0);
}

.menu-enter-active .font-medium,
.menu-enter-active .font-bold,
.menu-enter-active button,
.menu-enter-active input {
	animation: fadeIn 0.4s ease-out 0.1s forwards;
	opacity: 0;
}

@keyframes fadeIn {
	from {
		opacity: 0;
		transform: translateY(5px);
	}
	to {
		opacity: 1;
		transform: translateY(0);
	}
}

.cbx {
	position: relative;
	transition: background 0.2s ease;
	cursor: pointer;
	display: flex;
}

.cbx.bg-yellow {
	animation: jelly 0.4s ease;
}

@keyframes jelly {
	from {
		transform: scale(1, 1);
	}
	20% {
		transform: scale(1.3, 0.7);
	}
	40% {
		transform: scale(0.7, 1.3);
	}
	60% {
		transform: scale(1.1, 0.9);
	}
	80% {
		transform: scale(0.9, 1.1);
	}
	to {
		transform: scale(1, 1);
	}
}
</style>
