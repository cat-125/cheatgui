export const config = {
	symbols: {
		expanded: '▼',
		collapsed: '◀',
		resize: '&#9698;' // ◢
	},
	minWindowWidth: 150,
	minWindowHeight: 100,
	language: {
		'close': 'Close'
	}
};

export function updateConfig(newConfig) {
	function updateNestedConfig(config, newConfig) {
		for (const [key, value] of Object.entries(newConfig)) {
			if (typeof value === 'object' && typeof config[key] === 'object') {
				updateNestedConfig(config[key], value);
			} else if (config[key] !== undefined) {
				config[key] = value;
			}
		}
	}

	updateNestedConfig(config, newConfig);
}

export function getConfig() {
	return config;
}