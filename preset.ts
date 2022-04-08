export default definePreset({
	name: 'parav',
	options: {
		// ...
	},
	handler: async() => {
		await extractTemplates()
		// ...
	},
})
