<script setup>
import { useDarkMode } from "@/composables/useDarkMode";

const { isDarkMode } = useDarkMode();
</script>

<template>
	<div
		ref="container"
		class="fixed select-none pointer-events-none top-0 lg:top-30 left-0 h-screen w-screen flex items-center justify-center"
		aria-hidden="true">
		<div
			class="flex items-center justify-center font-weirdWords text-[50vw] leading-none opacity-5"
			:class="{ 'text-white': isDarkMode, 'text-black': !isDarkMode }">
			<span aria-hidden="true" title="Pascale Canal">PC</span>
		</div>
	</div>
</template>
