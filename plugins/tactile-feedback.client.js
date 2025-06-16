export default defineNuxtPlugin(() => {
    if (process.client) {
        // Détection mobile uniquement
        const isMobile =
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            );

        if (!isMobile) return; // Ne rien faire sur desktop

        // Fonction pour vibration type iPhone (pattern court et net)
        const hapticFeedback = () => {
            if (navigator.vibrate) {
                // Pattern qui imite le taptic feedback iOS : court et précis
                navigator.vibrate([3]);
            }
        };

        // Fonction pour ajouter la vibration à un lien
        const addVibrationToLink = (link) => {
            if (!link._hapticAdded) {
                link.addEventListener("touchstart", hapticFeedback, { passive: true });
                link._hapticAdded = true;
            }
        };

        // Fonction pour traiter tous les liens (a, button, éléments cliquables)
        const processClickableElements = () => {
            // NuxtLinks (qui sont rendus comme des <a> tags) et liens classiques
            const nuxtLinks = document.querySelectorAll("a");
            nuxtLinks.forEach(addVibrationToLink);

            // Boutons
            const buttons = document.querySelectorAll("button");
            buttons.forEach(addVibrationToLink);

            // Éléments avec rôle clickable
            const clickables = document.querySelectorAll(
                '[role="button"], .clickable, [onclick]'
            );
            clickables.forEach(addVibrationToLink);
        };

        // Observer pour les nouveaux éléments
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Si c'est un élément cliquable
                        if (
                            node.tagName === "A" ||
                            node.tagName === "BUTTON" ||
                            (node.hasAttribute?.("role") &&
                                node.getAttribute("role") === "button") ||
                            node.classList?.contains("clickable")
                        ) {
                            addVibrationToLink(node);
                        }
                        // Chercher dans les enfants
                        if (node.querySelectorAll) {
                            const clickableElements = node.querySelectorAll(
                                'a, button, [role="button"], .clickable, [onclick]'
                            );
                            clickableElements.forEach(addVibrationToLink);
                        }
                    }
                });
            });
        });

        // Démarrer une fois le DOM prêt
        const startHaptics = () => {
            processClickableElements();
            observer.observe(document.body, {
                childList: true,
                subtree: true,
            });
        };

        // Si le DOM est déjà prêt
        if (document.readyState === "loading") {
            document.addEventListener("DOMContentLoaded", startHaptics);
        } else {
            startHaptics();
        }
    }
});
