/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			fontFamily: {
				JetBrainsMono: ["JetBrains Mono", "monospace"],
				Poppins: ["Poppins", "sans-serif"],
				Raleway: ["Raleway", "sans-serif"],
				Roboto: ["Roboto", "sans-serif"],
				Merriweather: ["Merriweather", "sans-serif"],
				Lato: ["Lato"],
				Montserrat: ["Montserrat"],
			},
			transitionProperty: {},
			colors: {
				"green-pea": "#1A5632",
				tan: "#D2B887",
				nomad: "#B8B09C",
				corduroy: "#607875",
				safron: "#F5B335",
				"deep-sea": "#00806E",
				thunder: "#1D1D1B",
				"light-green": "#d7f4e3",
				"dark-green": "#0a401f",
				"mid-green": "#0e4524",
				sse: "#61366E",
				shss: "#201747",
				sba: "#79242F",
				master: "#F5B335",
			},
		},
	},
	plugins: [],
};
