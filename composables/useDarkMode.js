import { ref } from "vue";

const isDarkMode = ref(false);

export function useDarkMode() {
    return {
        isDarkMode,
    };
}