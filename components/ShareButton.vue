<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from "vue";

const props = defineProps({
	url: {
		type: String,
		default: "",
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
		validator: (value) =>
			["bottom-right", "bottom-left", "top-right", "top-left"].includes(value),
	},
	buttonText: {
		type: String,
		default: "Partager",
	},
	closeText: {
		type: String,
		default: "Fermer",
	},
});

const isOpen = ref(false);
const copied = ref(false);
const shareUrl = ref("");
const searchNetwork = ref("");
const shareMenuRef = ref(null);
const buttonRef = ref(null);

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

const filteredNetworks = computed(() => {
	if (!searchNetwork.value) {
		return networks.value;
	}

	const searchTerm = searchNetwork.value.toLowerCase().trim();
	return networks.value.filter((network) =>
		network.name.toLowerCase().includes(searchTerm)
	);
});

const resetCopyStatus = () => {
	setTimeout(() => {
		copied.value = false;
	}, 2000);
};

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

const handleClickOutside = (event) => {
	if (!isOpen.value) return;

	const buttonElement = buttonRef.value;
	const menuElement = shareMenuRef.value;

	if (
		buttonElement &&
		menuElement &&
		!buttonElement.contains(event.target) &&
		!menuElement.contains(event.target)
	) {
		isOpen.value = false;
	}
};

const handleEscapeKey = (event) => {
	if (isOpen.value && event.key === "Escape") {
		isOpen.value = false;
	}
};

const isClient = typeof window !== "undefined";

onMounted(() => {
	if (isClient) {
		shareUrl.value = props.url || window.location.href;

		document.addEventListener("click", handleClickOutside);
		document.addEventListener("keydown", handleEscapeKey);
	}
});

onUnmounted(() => {
	if (isClient) {
		document.removeEventListener("click", handleClickOutside);
		document.removeEventListener("keydown", handleEscapeKey);
	}
});

const toggleShareMenu = () => {
	isOpen.value = !isOpen.value;

	if (isOpen.value) {
		searchNetwork.value = "";
		setTimeout(() => {
			const searchInput = shareMenuRef.value?.querySelector("input");
			if (searchInput) {
				searchInput.focus();
			}
		}, 0);
	}
};

const copyLink = async () => {
	if (!isClient) return;

	try {
		await navigator.clipboard.writeText(shareUrl.value);
		copied.value = true;
		resetCopyStatus();
	} catch (err) {
		console.error("Erreur lors de la copie du lien:", err);
		try {
			const tempInput = document.createElement("input");
			tempInput.value = shareUrl.value;
			document.body.appendChild(tempInput);
			tempInput.select();
			document.execCommand("copy");
			document.body.removeChild(tempInput);
			copied.value = true;
			resetCopyStatus();
		} catch (fallbackErr) {
			console.error("Échec de la méthode de secours:", fallbackErr);
			alert(
				"Impossible de copier le lien. Votre navigateur ne prend pas en charge cette fonctionnalité."
			);
		}
	}
};

const share = (platform) => {
	if (!isClient) return;

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
		// Cas spéciaux pour les plateformes qui nécessitent le Web Share API
		case "threads":
		case "instagram":
		case "tiktok":
		case "snapchat":
			if (isClient && "share" in navigator) {
				navigator
					.share({
						title: props.title,
						text: props.description,
						url: shareUrl.value,
					})
					.catch((error) => console.error("Erreur de partage:", error));
			} else {
				copyLink();
				alert(
					`Le partage direct avec ${platform} n'est pas disponible. Le lien a été copié dans votre presse-papiers.`
				);
			}
			isOpen.value = false;
			return;
		default:
			return;
	}

	window.open(
		shareLink,
		"_blank",
		"width=600,height=500,location=yes,toolbar=no"
	);

	isOpen.value = false;
};
</script>

<template>
	<div class="relative inline-block">
		<!-- Bouton principal de partage -->
		<button
			ref="buttonRef"
			@click="toggleShareMenu"
			class="border border-black text-black active:scale-95 py-2 px-6 rounded-lg text-sm font-apercuBold hover:bg-black hover:text-white transition duration-200 focus:ring-opacity-50"
			:aria-expanded="isOpen"
			:aria-controls="'share-menu'"
			aria-haspopup="true"
			title="Ouvrir les options de partage">
			<span>{{ isOpen ? props.closeText : props.buttonText }}</span>
		</button>

		<!-- Menu de partage avec transition -->
		<transition name="fade">
			<div
				v-if="isOpen"
				ref="shareMenuRef"
				id="share-menu"
				class="absolute z-50 bg-white shadow-lg rounded-lg p-3 mt-2 border border-gray-200 w-80"
				:class="shareMenuPosition"
				role="dialog"
				aria-labelledby="share-title">
				<h2 id="share-title" class="sr-only">Options de partage</h2>

				<!-- Recherche de réseau social -->
				<div class="mb-3">
					<label for="search-network" class="sr-only"
						>Rechercher un réseau social</label
					>
					<input
						v-model="searchNetwork"
						type="text"
						id="search-network"
						placeholder="Rechercher un réseau..."
						class="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
						autocomplete="off" />
				</div>

				<p
					v-if="filteredNetworks.length === 0"
					class="text-center py-2 text-gray-500">
					Aucun réseau trouvé
				</p>

				<div
					v-else
					class="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2"
					role="menu">
					<!-- Copier le lien -->
					<button
						@click="copyLink"
						class="flex items-center space-x-2 p-2 rounded-md active:scale-97 hover:bg-blue-100 transition duration-200"
						aria-label="Copier le lien"
						role="menuitem">
						<span class="ml-0.5 flex items-center justify-center">
							<template v-if="!copied">
								<svg
									xmlns="http://www.w3.org/2000/svg"
									class="w-5 h-5"
									viewBox="0 0 24 24"
									fill="none"
									stroke="currentColor"
									stroke-width="2"
									stroke-linecap="round"
									stroke-linejoin="round"
									aria-hidden="true">
									<rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
									<path
										d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
								</svg>
							</template>
							<svg
								v-else
								xmlns="http://www.w3.org/2000/svg"
								class="w-5 h-5 text-green-600"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								stroke-width="2.5"
								stroke-linecap="round"
								stroke-linejoin="round"
								aria-hidden="true">
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
						class="flex items-center space-x-2 p-2 rounded-md hover:bg-blue-100 active:scale-97 transition duration-200"
						:aria-label="`Partager sur ${network.name}`"
						role="menuitem">
						<span class="flex items-center justify-center">
							<NuxtImg
								:src="`/svg/logos/${network.id}.svg`"
								:alt="`Icône ${network.name}`"
								:title="`Partager sur ${network.name}`"
								@error="$event.target.style.display = 'none'"
								class="w-6 h-6"
								loading="lazy"
								aria-hidden="true" />
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

::-webkit-scrollbar-track {
	border-radius: 10px;
}
</style>
