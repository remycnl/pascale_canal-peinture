export default defineAppConfig({
	resolve: {
		alias: {
			".prisma/client/edge": "./node_modules/.prisma/client/edge.js",
		},
	},
});
