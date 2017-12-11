export const PLUGIN_CONFIG_REQUEST = "PLUGIN_CONFIG_REQUEST"
export const PLUGIN_CONFIG_RESPONSE = "PLUGIN_CONFIG_RESPONSE"
export function requestPluginConfig(id) {
	return {
		type: PLUGIN_CONFIG_REQUEST,
		id: id,
	}
}
