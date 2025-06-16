<script setup>
import { computed, watch } from "vue";

const props = defineProps({
	currentPage: {
		type: Number,
		required: true,
	},
	totalPages: {
		type: Number,
		required: true,
	},
	isLoading: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["pageChange"]);

const pageNumbers = computed(() => {
	const pages = [];
	const isMobile = window.innerWidth < 640;

	pages.push(1);

	const range = isMobile ? 0 : 1;
	let startPage = Math.max(2, props.currentPage - range);
	let endPage = Math.min(props.totalPages - 1, props.currentPage + range);

	if (startPage > 2) {
		pages.push("...");
	}

	for (let i = startPage; i <= endPage; i++) {
		if (i > 1 && i < props.totalPages) {
			pages.push(i);
		}
	}

	if (endPage < props.totalPages - 1) {
		pages.push("...");
	}

	if (props.totalPages > 1) {
		pages.push(props.totalPages);
	}

	return pages;
});

const goToPrevPage = () => {
	if (props.currentPage > 1 && !props.isLoading) {
		emit("pageChange", props.currentPage - 1);
	}
};

const goToNextPage = () => {
	if (props.currentPage < props.totalPages && !props.isLoading) {
		emit("pageChange", props.currentPage + 1);
	}
};

const goToPage = (page) => {
	if (page !== "..." && page !== props.currentPage && !props.isLoading) {
		emit("pageChange", page);
	}
};

watch(
	() => props.totalPages,
	(newTotalPages) => {
		if (props.currentPage > newTotalPages && newTotalPages > 0) {
			emit("pageChange", newTotalPages);
		}
	}
);
</script>

<template>
	<div
		v-if="totalPages > 1"
		class="w-full flex justify-center items-center mt-16 mb-8">
		<nav class="flex items-center space-x-2" aria-label="Pagination">
			<!-- Previous button -->
			<button
				@click="goToPrevPage"
				:disabled="currentPage === 1 || isLoading"
				class="relative inline-flex items-center px-3 py-2 rounded-md border border-black text-sm font-apercuMedium transition-all duration-200 active:scale-95 cursor-pointer"
				:class="[
					currentPage === 1 || isLoading
						? 'opacity-50 cursor-not-allowed bg-gray-100'
						: 'hover:bg-gray-100',
				]"
				aria-label="Page précédente">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
						clip-rule="evenodd" />
				</svg>
			</button>

			<!-- Page numbers -->
			<div class="flex items-center space-x-1">
				<button
					v-for="(page, index) in pageNumbers"
					:key="index"
					@click="goToPage(page)"
					:disabled="page === '...' || page === currentPage || isLoading"
					class="relative inline-flex items-center min-w-[40px] justify-center px-3 py-2 rounded-md border text-sm font-apercuMedium transition-all duration-200 active:scale-95 cursor-pointer"
					:class="[
						page === currentPage
							? 'bg-yellow border-black font-apercuBold z-10'
							: page === '...'
							? 'border-gray-300 cursor-default'
							: isLoading
							? 'border-gray-300 opacity-50 cursor-not-allowed'
							: 'border-gray-300 hover:bg-gray-50 hover:border-gray-400',
					]"
					:aria-current="page === currentPage ? 'page' : undefined"
					:aria-label="
						page !== '...' ? `Page ${page}` : 'Points de suspension'
					">
					{{ page }}
				</button>
			</div>

			<!-- Next button -->
			<button
				@click="goToNextPage"
				:disabled="currentPage === totalPages || isLoading"
				class="relative inline-flex items-center px-3 py-2 rounded-md border border-black text-sm font-apercuMedium transition-all duration-200 active:scale-95 cursor-pointer"
				:class="[
					currentPage === totalPages || isLoading
						? 'opacity-50 cursor-not-allowed bg-gray-100'
						: 'hover:bg-gray-100',
				]"
				aria-label="Page suivante">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-5 w-5"
					viewBox="0 0 20 20"
					fill="currentColor">
					<path
						fill-rule="evenodd"
						d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
						clip-rule="evenodd" />
				</svg>
			</button>
		</nav>
	</div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s;
}
.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}
</style>
