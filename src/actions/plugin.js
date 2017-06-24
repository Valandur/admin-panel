export const PLUGINS_REQUEST = "PLUGINS_REQUEST"
export const PLUGINS_RESPONSE = "PLUGINS_RESPONSE"
export function requestPlugins(details = false) {
	return {
		type: PLUGINS_REQUEST,
		details: details,
	}
}
