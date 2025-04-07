<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

const props = defineProps({
	url: {
		type: String,
		default: () => "",
	},
	title: {
		type: String,
		default: "Regardez ce tableau !",
	},
	description: {
		type: String,
		default:
			"Je viens de découvrir ce tableau et je voulais le partager avec vous.",
	},
	position: {
		type: String,
		default: "bottom-right", // 'bottom-right', 'bottom-left', 'top-right', 'top-left'
	},
});

const isOpen = ref(false);
const copied = ref(false);
const shareUrl = ref("");
const searchNetwork = ref("");

// Liste complète des réseaux sociaux
const networks = ref([
	{ id: "email", name: "Email" },
	{ id: "facebook", name: "Facebook" },
	{ id: "twitter", name: "Twitter/X" },
	{ id: "linkedin", name: "LinkedIn" },
	{ id: "whatsapp", name: "WhatsApp" },
	{ id: "telegram", name: "Telegram" },
	{ id: "instagram", name: "Instagram" },
	{ id: "tiktok", name: "TikTok" },
	{ id: "reddit", name: "Reddit" },
	{ id: "pinterest", name: "Pinterest" },
	{ id: "snapchat", name: "Snapchat" },
	{ id: "discord", name: "Discord" },
	{ id: "messenger", name: "Messenger" },
	{ id: "slack", name: "Slack" },
	{ id: "tumblr", name: "Tumblr" },
	{ id: "threads", name: "Threads" },
]);

// Filtrer les réseaux selon la recherche
const filteredNetworks = computed(() => {
	let result = networks.value;

	// Filtrer par recherche
	if (searchNetwork.value) {
		result = result.filter((network) =>
			network.name.toLowerCase().includes(searchNetwork.value.toLowerCase())
		);
	}

	return result;
});

// Réinitialiser le copied après un délai
const resetCopyStatus = () => {
	setTimeout(() => {
		copied.value = false;
	}, 2000);
};

// Détermine la position du menu
const shareMenuPosition = computed(() => {
	switch (props.position) {
		case "bottom-left":
			return "left-0";
		case "top-right":
			return "right-0 bottom-full mb-2";
		case "top-left":
			return "left-0 bottom-full mb-2";
		case "bottom-right":
		default:
			return "right-0";
	}
});

// Obtenir l'URL actuelle si aucune n'est fournie
onMounted(() => {
	if (import.meta.client) {
		shareUrl.value = props.url || window.location.href;

		// Fermer le menu si on clique en dehors
		document.addEventListener("click", handleClickOutside);
	}
});

onUnmounted(() => {
	if (import.meta.client) {
		document.removeEventListener("click", handleClickOutside);
	}
});

const handleClickOutside = (event) => {
	const element = event.target;
	if (
		isOpen.value &&
		!event
			.composedPath()
			.includes(document.querySelector(".relative.inline-block"))
	) {
		isOpen.value = false;
	}
};

const toggleShareMenu = () => {
	isOpen.value = !isOpen.value;

	// Réinitialiser la recherche à l'ouverture
	if (isOpen.value) {
		searchNetwork.value = "";
	}
};

const copyLink = () => {
	if (import.meta.client) {
		navigator.clipboard
			.writeText(shareUrl.value)
			.then(() => {
				copied.value = true;
				resetCopyStatus();
			})
			.catch((err) => {
				console.error("Erreur lors de la copie du lien:", err);
			});
	}
};

const share = (platform) => {
	if (!import.meta.client) return;

	const encodedUrl = encodeURIComponent(shareUrl.value);
	const encodedTitle = encodeURIComponent(props.title);
	const encodedDescription = encodeURIComponent(props.description);

	let shareLink = "";

	switch (platform) {
		case "email":
			shareLink = `mailto:?subject=${encodedTitle}&body=${encodedDescription}%20${encodedUrl}`;
			break;
		case "facebook":
			shareLink = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
			break;
		case "twitter":
			shareLink = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`;
			break;
		case "linkedin":
			shareLink = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
			break;
		case "whatsapp":
			shareLink = `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`;
			break;
		case "telegram":
			shareLink = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
			break;
		case "reddit":
			shareLink = `https://www.reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`;
			break;
		case "pinterest":
			shareLink = `https://pinterest.com/pin/create/button/?url=${encodedUrl}&description=${encodedTitle}`;
			break;
		case "tumblr":
			shareLink = `https://www.tumblr.com/share/link?url=${encodedUrl}&name=${encodedTitle}&description=${encodedDescription}`;
			break;
		case "discord":
			shareLink = `https://discord.com/channels/@me?text=${encodedTitle}%20${encodedUrl}`;
			break;
		case "messenger":
			shareLink = `https://www.facebook.com/dialog/send?link=${encodedUrl}&app_id=291494419107518&redirect_uri=${encodedUrl}`;
			break;
		case "slack":
			shareLink = `https://slack.com/share?text=${encodedTitle}%20${encodedUrl}`;
			break;
		case "threads":
		case "instagram":
		case "tiktok":
		case "snapchat":
			if (navigator.share) {
				navigator
					.share({
						title: props.title,
						text: props.description,
						url: shareUrl.value,
					})
					.catch((error) => console.error("Erreur de partage:", error));
				return;
			}
			alert("Le partage natif n’est pas disponible sur ce navigateur.");
			return;
		default:
			return;
	}

	// Ouvrir le lien dans une nouvelle fenêtre
	window.open(shareLink, "_blank", "width=600,height=400");

	// Fermer le menu après le partage
	isOpen.value = false;
};
</script>

<template>
	<div class="relative inline-block">
		<!-- Bouton principal de partage -->
		<button
			@click="toggleShareMenu"
			class="border border-black text-black active:scale-95 py-2 px-6 rounded-lg text-sm font-apercuBold hover:bg-black hover:text-white transition duration-200">
			{{ isOpen ? "Fermer" : "Partager" }}
		</button>

		<!-- Menu de partage avec transition -->
		<transition name="fade">
			<div
				v-if="isOpen"
				class="absolute z-50 bg-white shadow-lg rounded-lg p-3 mt-2 border border-gray-200 w-80"
				:class="shareMenuPosition">
				<!-- Recherche de réseau social -->
				<div class="mb-3">
					<input
						v-model="searchNetwork"
						type="text"
						placeholder="Rechercher un réseau..."
						class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm" />
				</div>

				<div
					v-if="filteredNetworks.length === 0"
					class="text-center py-2 text-gray-500">
					Aucun réseau trouvé
				</div>

				<div
					v-else
					class="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2">
					<!-- Copier le lien -->
					<button
						@click="copyLink"
						class="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100 transition duration-200">
						<span class="ml-0.5 flex items-center justify-center">
							<NuxtImg
								v-if="!copied"
								src="/svg/copy.svg"
								alt="copy link"
								@contextmenu.prevent
								class="w-6 h-6" />
							<svg
								v-else
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round">
								<polyline points="20 6 9 17 4 12"></polyline>
							</svg>
						</span>
						<span>{{ copied ? "Copié !" : "Copier" }}</span>
					</button>
					<!-- Réseaux sociaux -->
					<button
						v-for="network in filteredNetworks"
						:key="network.id"
						@click="share(network.id)"
						class="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100 transition duration-200">
						<span class="flex items-center justify-center">
							<NuxtImg
								:src="`/svg/logos/${network.id}.svg`"
								:alt="network.name"
								@contextmenu.prevent
								class="w-7 h-7" />
						</span>
						<span>{{ network.name }}</span>
					</button>
				</div>
			</div>
		</transition>
	</div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.2s, transform 0.2s;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
	transform: translateY(-10px);
}
</style>
