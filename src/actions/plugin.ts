export const PLUGIN_CONFIG_REQUEST = "PLUGIN_CONFIG_REQUEST"
export const PLUGIN_CONFIG_RESPONSE = "PLUGIN_CONFIG_RESPONSE"
export function requestPluginConfig(id: string) {
	return {
		type: PLUGIN_CONFIG_REQUEST,
		id: id,
	}
}

export const PLUGIN_CONFIG_SET = "PLUGIN_CONFIG_SET"
export function setPluginConfig(name: string, conf: object) {
	return {
		type: PLUGIN_CONFIG_SET,
		name: name,
		conf: conf,
	}
}

export const PLUGIN_CONFIG_SAVE_REQUEST = "PLUGIN_CONFIG_SAVE_REQUEST"
export const PLUGIN_CONFIG_SAVE_RESPONSE = "PLUGIN_CONFIG_SAVE_RESPONSE"
export function requestPluginConfigSave(id: string, plugin: string, configs: Array<string>) {
	return {
		type: PLUGIN_CONFIG_SAVE_REQUEST,
		id: id,
		plugin: plugin,
		configs: configs,
	}
}
