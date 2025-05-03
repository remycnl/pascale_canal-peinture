<script setup>
import { ref, onMounted, computed } from "vue";
import { useFAQs } from "@/composables/useFAQs";

const { faqs, pending, error, refresh, createFAQ, updateFAQ, deleteFAQ } =
	useFAQs();
const sortedFaqs = computed(() => {
	return [...(faqs.value || [])].sort(
		(a, b) => (a.order || 0) - (b.order || 0)
	);
});

onMounted(async () => {
	await refresh();
	initializeTextareas();
});

const addFAQ = async () => {
	const maxOrder =
		(faqs.value?.length ?? 0) > 0
			? Math.max(...faqs.value.map((f) => f.order || 0))
			: -1;

	const newFAQ = await createFAQ({
		question: "",
		answer: "",
		isActive: true,
		order: maxOrder + 1,
	});
	faqs.value.push(newFAQ);
};

const toggleActive = async (faq) => {
	faq.isActive = !faq.isActive;
	await updateFAQ(faq.id, faq);
};

const updateFAQData = async (faq) => {
	await updateFAQ(faq.id, faq);
};

const removeFAQ = async (id) => {
	if (confirm("Êtes-vous sûr de vouloir supprimer cette FAQ ?")) {
		await deleteFAQ(id);
		faqs.value = faqs.value.filter((faq) => faq.id !== id);
	}
};

const moveUp = async (faq) => {
	const index = sortedFaqs.value.findIndex((f) => f.id === faq.id);
	if (index > 0) {
		const prevFaq = sortedFaqs.value[index - 1];

		const tempOrder = faq.order;
		faq.order = prevFaq.order;
		prevFaq.order = tempOrder;

		await updateFAQ(faq.id, faq);
		await updateFAQ(prevFaq.id, prevFaq);
	}
};

const moveDown = async (faq) => {
	const index = sortedFaqs.value.findIndex((f) => f.id === faq.id);
	if (index < sortedFaqs.value.length - 1) {
		const nextFaq = sortedFaqs.value[index + 1];

		const tempOrder = faq.order;
		faq.order = nextFaq.order;
		nextFaq.order = tempOrder;

		await updateFAQ(faq.id, faq);
		await updateFAQ(nextFaq.id, nextFaq);
	}
};

const formatDate = (dateString) => {
	const date = new Date(dateString);
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "short",
		day: "numeric",
	});
};

const autoResize = (element) => {
	element.style.height = "auto";
	element.style.height = element.scrollHeight + "px";
};

const initializeTextareas = () => {
	setTimeout(() => {
		document.querySelectorAll("textarea").forEach((textarea) => {
			autoResize(textarea);
		});
	}, 0);
};
</script>

<template>
	<div
		class="mt-20 md:mt-40 flex flex-col gap-y-10 md:gap-y-30 justify-center items-center">
		<div class="w-full flex items-center mb-8">
			<div
				class="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
			<div class="mx-2 sm:mx-4">
				<NuxtImg
					src="/img/logo.png"
					alt="Logo"
					title="Logo"
					format="webp"
					class="w-16 sm:w-20 md:w-28 h-auto" />
			</div>
			<div
				class="flex-grow h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
		</div>

		<div
			class="w-full max-w-7xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
			<div
				class="bg-black text-white p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-center">
				<h2 class="text-2xl sm:text-3xl font-apercuBold mb-4 sm:mb-0">
					Gestion des FAQs
				</h2>
				<button
					@click="addFAQ"
					class="bg-yellow active:scale-95 text-black px-4 py-2 rounded-lg hover:bg-yellow/90 transition-all duration-200 flex items-center">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						class="h-5 w-5 mr-2"
						viewBox="0 0 20 20"
						fill="currentColor">
						<path
							fill-rule="evenodd"
							d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
							clip-rule="evenodd" />
					</svg>
					Ajouter une FAQ
				</button>
			</div>

			<div v-if="sortedFaqs.length === 0" class="text-center py-16 bg-gray-100">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-16 w-16 mx-auto text-gray-400"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
				</svg>
				<p class="mt-4 text-gray-600">
					Aucune FAQ disponible. Cliquez sur "Ajouter une FAQ" pour commencer.
				</p>
			</div>

			<div class="divide-y max-h-[70vh] overflow-y-auto divide-gray-200">
				<div
					v-for="(faq, index) in sortedFaqs"
					:key="faq.id"
					class="px-4 sm:px-6 py-4 hover:bg-gray-50 transition-colors group relative">
					<div class="absolute top-4 right-4">
						<button
							@click="removeFAQ(faq.id)"
							class="text-red-500 hover:text-red-700 active:scale-95 transition-colors duration-200">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
							</svg>
						</button>
					</div>

					<div
						class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 space-y-2 sm:space-y-0">
						<div
							class="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
							<div class="flex space-x-2 bg-gray-100 p-1 rounded-lg">
								<button
									@click="moveUp(faq)"
									:disabled="index === 0"
									class="p-2 rounded-md active:scale-95 transition-colors duration-200"
									:class="
										index === 0
											? 'text-gray-300'
											: 'text-gray-600 hover:bg-gray-200'
									">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
											clip-rule="evenodd" />
									</svg>
								</button>
								<button
									@click="moveDown(faq)"
									:disabled="index === sortedFaqs.length - 1"
									class="p-2 rounded-md active:scale-95 transition-colors duration-200"
									:class="
										index === sortedFaqs.length - 1
											? 'text-gray-300'
											: 'text-gray-600 hover:bg-gray-200'
									">
									<svg
										xmlns="http://www.w3.org/2000/svg"
										class="h-4 w-4"
										viewBox="0 0 20 20"
										fill="currentColor">
										<path
											fill-rule="evenodd"
											d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
											clip-rule="evenodd" />
									</svg>
								</button>
								<span
									class="text-xs font-apercuMedium text-gray-500 flex items-center bg-gray-200 px-2 py-1 rounded-md ml-2"
									>Position: {{ faq.order }}</span
								>
							</div>
						</div>
					</div>

					<div class="flex flex-col">
						<input
							v-model="faq.question"
							@change="updateFAQData(faq)"
							class="w-full px-3 py-2 rounded-2xl text-base sm:text-lg font-apercuMediumbold text-black mb-2"
							placeholder="Saisissez votre question" />
						<textarea
							v-model="faq.answer"
							@change="updateFAQData(faq)"
							@input="autoResize($event.target)"
							class="w-full px-3 py-2 rounded-2xl text-gray-700 min-h-[80px] overflow-hidden resize-none"
							placeholder="Saisissez votre réponse"></textarea>
					</div>

					<div
						class="mt-2 text-xs text-gray-400 flex justify-between items-center">
						<span>Créé le : {{ formatDate(faq.createdAt) }}</span>
						<div class="absolute bottom-4 right-4">
							<div class="flex items-center space-x-2">
								<span class="text-xs font-apercuMedium" :class="faq.isActive ? 'text-green-500' : 'text-gray-400'">
									{{ faq.isActive ? 'Active' : 'Inactive' }}
								</span>
								<label class="switch">
									<input
										type="checkbox"
										:checked="faq.isActive"
										@change="toggleActive(faq)" />
									<span class="slider"></span>
								</label>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.switch {
	position: relative;
	display: inline-block;
	width: 2.8em;
	height: 1.4em;
}

.switch input {
	display: none;
	opacity: 0;
	width: 0;
	height: 0;
}

.slider {
	position: absolute;
	cursor: pointer;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background-color: var(--color-black);
	transition: 0.2s;
	border-radius: 30px;
}

.slider:before {
	position: absolute;
	content: "";
	height: 1em;
	width: 1em;
	border-radius: 20px;
	left: 0.2em;
	bottom: 0.2em;
	background-color: #aeaaae;
	transition: 0.4s;
}

input:checked + .slider::before {
	background-color: var(--color-yellow);
}

input:checked + .slider {
	background-color: #7c7541;
}

input:focus + .slider {
	box-shadow: 0 0 1px #7c7541;
}

input:checked + .slider:before {
	transform: translateX(1.4em);
}
</style>
