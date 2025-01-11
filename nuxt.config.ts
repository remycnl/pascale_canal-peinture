// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	css: ["@/assets/css/main.css", "@/assets/css/scrollBar.css"],
	modules: ["@nuxtjs/tailwindcss", "@nuxt/image"],

	plugins: [{ src: "@/plugins/global.js", mode: "client" }],
});
