<!-- /components/admin/NewsletterSubscribers.vue -->
<template>
	<div
		class="mt-20 md:mt-40 flex flex-col gap-y-10 md:gap-y-30 justify-center items-center">
		<div class="w-full flex items-center mb-8">
			<div
				class="grow h-0.5 bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
			<div class="mx-2 sm:mx-4">
				<NuxtImg
					src="/img/logo.png"
					alt="Logo"
					title="Logo"
					format="webp"
					class="w-16 sm:w-20 md:w-28 h-auto" />
			</div>
			<div
				class="grow h-0.5 bg-linear-to-r from-transparent via-gray-300 to-transparent"></div>
		</div>
		<div
			class="w-full rounded-2xl bg-black/10 backdrop-blur-sm p-4 md:p-10 lg:p-20">
			<h2 class="text-2xl font-apercuBold mb-6">
				Gestion des abonnés à la newsletter
			</h2>

			<!-- Filtres -->
			<div class="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
				<div class="w-full flex flex-col h-full">
					<label class="block text-sm font-apercuMedium mb-1"
						>Type d'abonnement</label
					>
					<select
						v-model="filters.subscriptionType"
						class="border rounded px-3 py-2 grow">
						<option value="">Tous les types</option>
						<option value="NEW_ARTWORK">Nouvelles œuvres</option>
						<option value="EVENTS">Événements</option>
						<option value="BOTH">Les deux</option>
					</select>
				</div>

				<div class="w-full flex flex-col h-full">
					<label class="block text-sm font-apercuMedium mb-1">Statut</label>
					<select
						v-model="filters.isActive"
						class="border rounded px-3 py-2 grow">
						<option value="">Tous les statuts</option>
						<option :value="true">Actifs</option>
						<option :value="false">Désabonnés</option>
					</select>
				</div>

				<div class="w-full flex flex-col h-full">
					<label class="block text-sm font-apercuMedium mb-1"
						>Recherche par email</label
					>
					<input
						v-model="filters.search"
						type="text"
						placeholder="Rechercher..."
						class="border rounded px-3 py-2 grow" />
				</div>
			</div>

			<!-- Mode d'envoi de newsletter -->
			<div class="mb-8 border p-4 rounded-lg bg-gray-50">
				<h3 class="text-lg font-apercuMedium mb-3">Envoyer une newsletter</h3>

				<div class="mb-4">
					<label class="block text-sm font-apercuMedium mb-1"
						>Type de destinataires</label
					>
					<select
						v-model="newsletter.type"
						class="border rounded px-3 py-2 w-full">
						<option value="NEW_ARTWORK">Abonnés aux nouvelles œuvres</option>
						<option value="EVENTS">Abonnés aux événements</option>
						<option value="BOTH">Tous les abonnés</option>
					</select>
				</div>

				<div class="mb-4">
					<label class="block text-sm font-apercuMedium mb-1">Sujet</label>
					<input
						v-model="newsletter.subject"
						type="text"
						placeholder="Sujet de l'email"
						class="border rounded px-3 py-2 w-full" />
				</div>

				<div class="mb-4">
					<label class="block text-sm font-apercuMedium mb-1">Contenu HTML</label>
					<textarea
						v-model="newsletter.content"
						rows="5"
						placeholder="<h1>Titre</h1><p>Contenu...</p>"
						class="border rounded px-3 py-2 w-full"></textarea>
				</div>

				<div class="flex gap-2 mb-4">
					<button
						@click="showPreview = !showPreview"
						class="px-4 py-2 bg-gray-200 border border-black rounded hover:bg-gray-300"
						:disabled="!newsletter.subject || !newsletter.content">
						{{ showPreview ? "Masquer l'aperçu" : "Prévisualiser" }}
					</button>

					<button
						@click="sendNewsletter"
						class="px-4 py-2 bg-yellow border border-black rounded hover:bg-yellow/80"
						:disabled="
							isNewsletterSending || !newsletter.subject || !newsletter.content
						">
						<span v-if="isNewsletterSending">Envoi en cours...</span>
						<span v-else>Envoyer la newsletter</span>
					</button>
				</div>

				<div
					v-if="newsletterMessage"
					class="mt-3 p-3 rounded"
					:class="
						newsletterSuccess
							? 'bg-green-100 text-green-700'
							: 'bg-red-100 text-red-700'
					">
					{{ newsletterMessage }}
				</div>
			</div>

			<!-- Prévisualisation de la newsletter (visible uniquement si showPreview est true) -->
			<div v-if="showPreview" class="mb-8 border rounded-lg overflow-hidden">
				<!-- En-tête de la prévisualisation -->
				<div class="bg-gray-100 px-6 py-4 border-b">
					<h3 class="text-lg font-apercuMedium">Prévisualisation de l'email</h3>
				</div>

				<!-- Aperçu de l'email -->
				<div class="p-6 bg-white">
					<!-- Informations sur l'email -->
					<div class="bg-gray-100 p-3 rounded-md mb-4">
						<div>
							<span class="font-apercuMedium">De:</span> Pascale Canal &lt;{{
								senderEmail || "noreply@example.com"
							}}&gt;
						</div>
						<div>
							<span class="font-apercuMedium">À:</span> Abonnés ({{
								getRecipientTypeText()
							}})
						</div>
						<div>
							<span class="font-apercuMedium">Sujet:</span>
							{{ newsletter.subject || "[Aucun sujet]" }}
						</div>
					</div>

					<!-- Contenu de l'email -->
					<div class="border rounded-md p-6 bg-white max-h-96 overflow-y-auto">
						<!-- Contenu personnalisé -->
						<div class="email-content" v-html="newsletter.content"></div>

						<!-- Pied de page avec lien de désabonnement -->
						<div
							class="mt-5 pt-4 border-t border-gray-200 text-xs text-gray-600">
							<p class="mb-1">
								Vous recevez cet email car vous êtes abonné à ma newsletter.
							</p>
							<p>
								Pour vous désabonner,
								<a href="#" class="text-blue-600 underline">cliquez ici</a>.
							</p>
						</div>
					</div>
				</div>

				<!-- Actions en bas de la prévisualisation -->
				<div class="flex justify-end gap-2 px-6 py-4 bg-gray-50 border-t">
					<button
						@click="sendNewsletter"
						class="px-4 py-2 bg-yellow border border-black rounded-md hover:bg-yellow/80"
						:disabled="isNewsletterSending">
						<span v-if="isNewsletterSending">Envoi en cours...</span>
						<span v-else>Envoyer maintenant</span>
					</button>
				</div>
			</div>

			<!-- Tableau des abonnés -->
			<div class="overflow-x-auto">
				<table class="w-full border-collapse">
					<thead>
						<tr class="bg-gray-100">
							<th class="border px-4 py-2 text-left">Email</th>
							<th class="border px-4 py-2 text-left">Type d'abonnement</th>
							<th class="border px-4 py-2 text-left">Statut</th>
							<th class="border px-4 py-2 text-left">Date d'inscription</th>
							<th class="border px-4 py-2 text-left">Actions</th>
						</tr>
					</thead>
					<tbody v-if="!isLoading">
						<tr
							v-for="subscriber in filteredSubscribers"
							:key="subscriber.id"
							class="hover:bg-gray-50">
							<td class="border px-4 py-2">{{ subscriber.email }}</td>
							<td class="border px-4 py-2">
								<span v-if="subscriber.subscriptionType === 'NEW_ARTWORK'"
									>Nouvelles œuvres</span
								>
								<span v-else-if="subscriber.subscriptionType === 'EVENTS'"
									>Événements</span
								>
								<span v-else>Les deux</span>
							</td>
							<td class="border px-4 py-2">
								<span
									:class="
										subscriber.isActive
											? 'bg-green-100 text-green-800'
											: 'bg-red-100 text-red-800'
									"
									class="px-2 py-1 rounded text-xs">
									{{ subscriber.isActive ? "Actif" : "Désabonné" }}
								</span>
							</td>
							<td class="border px-4 py-2">
								{{ formatDate(subscriber.createdAt) }}
							</td>
							<td class="border px-4 py-2">
								<button
									v-if="subscriber.isActive"
									@click="unsubscribe(subscriber.id)"
									class="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
									:disabled="isActionLoading(subscriber.id)">
									{{ isActionLoading(subscriber.id) ? "..." : "Désabonner" }}
								</button>
								<button
									v-else
									@click="reactivate(subscriber.id)"
									class="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
									:disabled="isActionLoading(subscriber.id)">
									{{ isActionLoading(subscriber.id) ? "..." : "Réactiver" }}
								</button>
							</td>
						</tr>
						<tr v-if="filteredSubscribers.length === 0">
							<td
								colspan="5"
								class="border px-4 py-8 text-center text-gray-500">
								Aucun abonné ne correspond aux critères sélectionnés
							</td>
						</tr>
					</tbody>
					<tbody v-else>
						<tr>
							<td colspan="5" class="border px-4 py-8 text-center">
								<div class="flex justify-center">
									<span
										class="inline-block w-6 h-6 border-2 border-t-yellow rounded-full animate-spin"></span>
								</div>
								<div class="mt-2 text-gray-600">Chargement des abonnés...</div>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			<!-- Pagination -->
			<div class="mt-4 flex justify-between items-center">
				<div class="text-sm text-gray-600">
					{{ totalSubscribers }} abonné(s) au total
				</div>

				<div class="flex gap-2">
					<button
						@click="currentPage--"
						:disabled="currentPage === 1"
						class="px-3 py-1 border rounded disabled:opacity-50">
						Précédent
					</button>
					<span class="px-3 py-1"
						>Page {{ currentPage }} sur {{ totalPages }}</span
					>
					<button
						@click="currentPage++"
						:disabled="currentPage >= totalPages"
						class="px-3 py-1 border rounded disabled:opacity-50">
						Suivant
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";

const config = useRuntimeConfig();

// État
const subscribers = ref([]);
const isLoading = ref(true);
const loadingActions = ref(new Set());
const totalSubscribers = ref(0);
const currentPage = ref(1);
const pageSize = 10;
const showPreview = ref(false);
const senderEmail = config.public.contactEmail;

// Filtres
const filters = ref({
	subscriptionType: "",
	isActive: "",
	search: "",
});

// Newsletter
const newsletter = ref({
	subject: "",
	content: "",
	type: "BOTH",
});
const isNewsletterSending = ref(false);
const newsletterMessage = ref("");
const newsletterSuccess = ref(false);

// Méthodes
const fetchSubscribers = async () => {
	isLoading.value = true;
	try {
		// Dans une vraie application, vous implémenteriez un endpoint API pour cette fonctionnalité
		const response = await $fetch("/api/newsletter/subscribers", {
			params: {
				page: currentPage.value,
				pageSize,
				...filters.value,
			},
		});

		subscribers.value = response.subscribers;
		totalSubscribers.value = response.total;
	} catch (error) {
		console.error("Erreur lors du chargement des abonnés:", error);
	} finally {
		isLoading.value = false;
	}
};

const unsubscribe = async (id) => {
	loadingActions.value.add(id);
	try {
		await $fetch(`/api/newsletter/unsubscribe/${id}`, { method: "POST" });
		// Mettre à jour l'état de l'abonné dans la liste locale
		const index = subscribers.value.findIndex((s) => s.id === id);
		if (index !== -1) {
			subscribers.value[index].isActive = false;
			subscribers.value[index].unsubscribedAt = new Date();
		}
	} catch (error) {
		console.error("Erreur lors de la désactivation:", error);
	} finally {
		loadingActions.value.delete(id);
	}
};

const reactivate = async (id) => {
	loadingActions.value.add(id);
	try {
		await $fetch(`/api/newsletter/reactivate/${id}`, { method: "POST" });
		// Mettre à jour l'état de l'abonné dans la liste locale
		const index = subscribers.value.findIndex((s) => s.id === id);
		if (index !== -1) {
			subscribers.value[index].isActive = true;
			subscribers.value[index].unsubscribedAt = null;
		}
	} catch (error) {
		console.error("Erreur lors de la réactivation:", error);
	} finally {
		loadingActions.value.delete(id);
	}
};

const getRecipientTypeText = () => {
	switch (newsletter.value.type) {
		case "NEW_ARTWORK":
			return "Abonnés aux nouvelles œuvres";
		case "EVENTS":
			return "Abonnés aux événements";
		case "BOTH":
		default:
			return "Tous les abonnés actifs";
	}
};

const sendNewsletter = async () => {
	if (!newsletter.value.subject || !newsletter.value.content) {
		newsletterMessage.value = "Veuillez remplir tous les champs";
		newsletterSuccess.value = false;
		return;
	}

	isNewsletterSending.value = true;
	newsletterMessage.value = "";

	try {
		const response = await $fetch("/api/newsletter/send", {
			method: "POST",
			body: newsletter.value,
		});

		newsletterSuccess.value = response.success;
		newsletterMessage.value = response.message;

		// Réinitialiser les champs si succès
		if (response.success) {
			newsletter.value.subject = "";
			newsletter.value.content = "";
			showPreview.value = false;
		}
	} catch (error) {
		console.error("Erreur lors de l'envoi de la newsletter:", error);
		newsletterSuccess.value = false;
		newsletterMessage.value =
			"Une erreur est survenue lors de l'envoi de la newsletter";
	} finally {
		isNewsletterSending.value = false;
	}
};

const formatDate = (dateString) => {
	const date = new Date(dateString);
	return new Intl.DateTimeFormat("fr-FR", {
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(date);
};

const isActionLoading = (id) => {
	return loadingActions.value.has(id);
};

// Computed properties
const filteredSubscribers = computed(() => {
	return subscribers.value;
});

const totalPages = computed(() => {
	return Math.ceil(totalSubscribers.value / pageSize) || 1;
});

// Watchers
watch(
	[currentPage, filters],
	() => {
		fetchSubscribers();
	},
	{ deep: true }
);

// Cycle de vie
onMounted(() => {
	fetchSubscribers();
});
</script>

<style scoped>
/* Style global pour que le contenu HTML prévisualisé s'affiche correctement */
:deep(.email-content) {
	font-family: Arial, sans-serif;
	line-height: 1.5;
	color: #333;
}

:deep(.email-content h1) {
	font-size: 24px;
	margin-bottom: 16px;
	color: #000;
}

:deep(.email-content h2) {
	font-size: 20px;
	margin-bottom: 14px;
	color: #222;
}

:deep(.email-content p) {
	margin-bottom: 12px;
}

:deep(.email-content a) {
	color: #0066cc;
	text-decoration: underline;
}

:deep(.email-content img) {
	max-width: 100%;
	height: auto;
}
</style>