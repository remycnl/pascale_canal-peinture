/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./components/**/*.{js,vue,ts}",
		"./layouts/**/*.vue",
		"./pages/**/*.vue",
		"./plugins/**/*.{js,ts}",
		"./assets/**/*.{js,ts}",
		"./error.vue",
	],
	theme: {
		extend: {
			colors: {
				black: "#222222",
				white: "#F8F8F8",
				grayDark: "#4D4D4D",
				gold: "#D0B285",
				yellow: "#FFF083",
				cream:"#FEF9E1"
			},
			fontFamily: {
				apercuBold: ['ApercuPro-Bold', 'sans-serif'],
				apercuLight: ['ApercuPro-Light', 'sans-serif'],
				apercuRegular: ['ApercuPro-Regular', 'sans-serif'],
				apercuMedium: ['ApercuPro-Medium', 'sans-serif'],
			},
			borderRadius: {
				'2sm': '0.25rem', // 4px
			},
		},
	},
	plugins: [],
};
