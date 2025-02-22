import { watch } from "vue";
import { useDarkMode } from "@/composables/useDarkMode";
import { useRoute } from "vue-router";

export default defineNuxtPlugin(() => {
    const { isDarkMode } = useDarkMode();
    const route = useRoute();

    const updateBodyStyles = (darkMode) => {
        if (import.meta.client) {
            if (darkMode) {
                document.body.style.backgroundColor = 'var(--color-black)';
                document.body.style.color = 'var(--color-white)';
            } else {
                document.body.style.backgroundColor = 'var(--color-white)';
                document.body.style.color = 'var(--color-black)';
            }
        }
    };
    
    watch(
        () => route.path,
        (newPath) => {
            isDarkMode.value = newPath === "/qui-suis-je" || newPath === "/contact";
            updateBodyStyles(isDarkMode.value);
        },
        { immediate: true }
    );
});