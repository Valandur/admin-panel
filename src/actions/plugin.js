export const PLUGINS_REQUEST = "PLUGINS_REQUEST"
export const PLUGINS_RESPONSE = "PLUGINS_RESPONSE"
export function requestPlugins(details = false) {
	return {
		type: PLUGINS_REQUEST,
		details: details,
	}
}

export const PLUGIN_CONFIG_REQUEST = "PLUGIN_CONFIG_REQUEST"
export const PLUGIN_CONFIG_RESPONSE = "PLUGIN_CONFIG_RESPONSE"
export function requestPluginConfig(id) {
	return {
		type: PLUGIN_CONFIG_REQUEST,
		id: id,
	}
}
