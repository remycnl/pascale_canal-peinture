// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	css: ["@/assets/css/main.css", "@/assets/css/scrollBar.css"],
	modules: ["@nuxtjs/tailwindcss", "@nuxt/image", "@prisma/nuxt"],

	plugins: [{ src: "@/plugins/smooth-scroll.client.js", mode: "client" }],

	runtimeConfig: {
		public: {
		  NUXT_SECRET_KEY: process.env.NUXT_SECRET_KEY
		}
	  }
});
