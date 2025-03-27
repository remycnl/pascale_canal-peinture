import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
	compatibilityDate: "2024-11-01",
	devtools: { enabled: true },
	css: [
		"@/assets/css/main.css",
		"@/assets/css/scrollBar.css",
		"@/assets/css/transition.css",
	],
	modules: [
		"@nuxt/image",
		"@prisma/nuxt",
		"@nuxtjs/sitemap",
		"@nuxtjs/robots",
		"nuxt-schema-org",
	],
	plugins: [
		{ src: "@/plugins/smooth-scroll.client.js", mode: "client" },
		{ src: "@/plugins/fluid-cursor-webgl.client.js", mode: "client" },
	],
	vite: {
		plugins: [tailwindcss()],
		resolve: {
			alias: {
				".prisma/client/index-browser":
					"./node_modules/.prisma/client/index-browser.js",
			},
		},
	},
	nitro: {
		preset: "vercel",
		moduleSideEffects: ["@prisma/client"],
		prerender: {
			crawlLinks: true,
			routes: ["/"],
		},
	},
	site: {
		url: process.env.NUXT_SITE_URL || "http://localhost:3000",
		name:
			process.env.NUXT_SITE_NAME ||
			"Pascale Canal | Artiste Peintre • Exposition en ligne",
	},
	robots: {
		disallow: ["/secret"],
	},
	sitemap: {
		defaults: {
			priority: 0.5,
			changefreq: "weekly",
		},
		urls: [
			{
				loc: "/",
				priority: 1.0,
				changefreq: "daily",
				lastmod: new Date().toISOString(),
			},
			{
				loc: "/comment-ca-marche",
				priority: 0.9,
				changefreq: "weekly",
			},
			{
				loc: "/qui-suis-je",
				priority: 0.8,
				changefreq: "monthly",
			},
			{
				loc: "/contact",
				priority: 0.7,
				changefreq: "monthly",
			},
			{
				loc: "/faq",
				priority: 0.6,
				changefreq: "weekly",
			},
			{
				loc: "/cgu",
				priority: 0.4,
				changefreq: "yearly",
			},
			{
				loc: "/mentions-legales",
				priority: 0.3,
				changefreq: "yearly",
			},
			{
				loc: "/politique-de-confidentialite",
				priority: 0.3,
				changefreq: "yearly",
			},
		],
	},
	schemaOrg: {
		minify: true,

		identity: {
			type: 'Person',
			name: 'Pascale Canal',
			url: process.env.NUXT_SITE_URL || "http://localhost:3000",
			sameAs: [
				"https://www.linkedin.com/in/pascale-canal",
			],
		},
	},
	routeRules: {
		"/secret/**": { robots: false },
	},
	runtimeConfig: {
		public: {
			NUXT_SECRET_KEY: process.env.NUXT_SECRET_KEY,
			siteUrl: process.env.NUXT_SITE_URL || "http://localhost:3000",
			siteName:
				process.env.NUXT_SITE_NAME ||
				"Pascale Canal | Artiste Peintre • Exposition en ligne",
		},
	},
});
