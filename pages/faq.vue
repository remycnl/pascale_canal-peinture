<script setup>
import { ref, onMounted, computed } from "vue";
import { useFAQs } from "@/composables/useFAQs";

const faqs = ref([]);

const { fetchFAQs } = useFAQs();
onMounted(async () => {
	faqs.value = await fetchFAQs().then((data) =>
		data
			.filter(
				(faq) =>
					faq.isActive === true &&
					faq.question &&
					faq.question.trim() !== "" &&
					faq.answer &&
					faq.answer.trim() !== ""
			)
			.map((faq) => ({ ...faq, isOpen: false }))
	);
});

const sortedFAQs = computed(() =>
	[...faqs.value].sort((a, b) => (a.order || 0) - (b.order || 0))
);

const toggleFAQ = (faq) => {
	faq.isOpen = !faq.isOpen;
};
</script>

<template>
	<div class="relative min-h-screen pt-10 md:pt-20">
		<h1
			class="flex flex-col text-4xl sm:text-5xl md:text-7xl lg:text-8xl 2xl:text-[180px] leading-tight 2xl:leading-[180px] font-apercuBold text-left w-full">
			Frequently
			<div></div>
			Asked Questions
		</h1>

		<div class="mt-10 md:mt-20 lg:mt-30 space-y-5 md:space-y-10">
			<div
				v-for="faq in sortedFAQs"
				:key="faq.id"
				class="bg-black active:scale-99 transition-transform border-4 md:border-5 border-black text-white rounded-2xl overflow-hidden">
				<div
					@click="toggleFAQ(faq)"
					class="flex justify-between items-center gap-x-5 p-3 sm:p-4 md:p-6 lg:p-8 cursor-pointer transition-colors">
					<h2
						class="w-11/12 text-base sm:text-lg md:text-xl lg:text-4xl font-aperçuBold">
						{{ faq.question }}
					</h2>
					<svg
						:class="{ 'rotate-180': faq.isOpen }"
						class="w-1/12 h-5 sm:h-6 md:h-8 lg:h-10 transition-transform"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
						xmlns="http://www.w3.org/2000/svg">
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M19 9l-7 7-7-7"></path>
					</svg>
				</div>

				<div
					v-if="faq.isOpen"
					class="p-5 sm:p-6 md:p-7 lg:p-8 bg-white text-xs sm:text-sm md:text-lg lg:text-2xl text-gray-700">
					{{ faq.answer }}
				</div>
			</div>
		</div>
	</div>
</template>
