import { performanceManager, deviceUtils } from "@/utils/animationPerformance";

export default defineNuxtPlugin((nuxtApp) => {
	if (import.meta.client) {
		performanceManager.scheduleTask(() => {
		}, "low");

		nuxtApp.hook("page:start", () => {
			deviceUtils.clearCache();
		});

		nuxtApp.hook("app:beforeMount", () => {
			performanceManager.cleanup();
			deviceUtils.clearCache();
		});
	}
});
