export const config = {
	symbols: {
		expanded: '▼',
		collapsed: '◀',
		resize: '&#9698;' // ◢
	},
	minWindowWidth: 150,
	minWindowHeight: 100,
	language: {
		close: 'Close'
	}
};

export function updateConfig(newConfig: object) {
	function updateNestedConfig(config: any, newConfig: object) {
		for (const [key, value] of Object.entries(newConfig)) {
			if (typeof value === 'object' && typeof config[key as keyof object] === 'object') {
				updateNestedConfig(config[key as keyof object], value);
			} else if (config[key as keyof object] !== undefined) {
				config[key] = value;
			}
		}
	}

	updateNestedConfig(config, newConfig);
}

export function getConfig() {
	return config;
}
