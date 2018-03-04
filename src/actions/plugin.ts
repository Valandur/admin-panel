import { Action } from "redux"
import { PluginContainer } from "../fetch"

export enum TypeKeys {
	CONFIG_REQUEST = "PLUGIN_CONFIG_REQUEST",
	CONFIG_RESPONSE = "PLUGIN_CONFIG_RESPONSE",
	CONFIG_SAVE_REQUEST = "PLUGIN_CONFIG_SAVE_REQUEST",
	CONFIG_SAVE_RESPONSE = "PLUGIN_CONFIG_SAVE_RESPONSE",
}

export interface PluginConfigRequestAction extends Action {
	type: TypeKeys.CONFIG_REQUEST
	id: string
}
export function requestPluginConfig(id: string): PluginConfigRequestAction {
	return {
		type: TypeKeys.CONFIG_REQUEST,
		id: id,
	}
}

export interface PluginConfigResponseAction extends Action {
	type: TypeKeys.CONFIG_RESPONSE
	configs: {
		[x: string]: any
	}
}
export function respondPluginConfig(configs: { [x: string]: any }): PluginConfigResponseAction {
	return {
		type: TypeKeys.CONFIG_RESPONSE,
		configs,
	}
}

export interface PluginConfigSaveRequestAction extends Action {
	type: TypeKeys.CONFIG_SAVE_REQUEST
	id: string
	plugin: PluginContainer
	configs: {
		[x: string]: any
	}
}
export function requestPluginConfigSave(id: string, plugin: PluginContainer, configs: { [x: string]: any }):
		PluginConfigSaveRequestAction {
	return {
		type: TypeKeys.CONFIG_SAVE_REQUEST,
		id: id,
		plugin: plugin,
		configs: configs,
	}
}

export interface PluginConfigSaveResponseAction extends Action {
	type: TypeKeys.CONFIG_SAVE_RESPONSE
	configs: {
		[x: string]: any
	}
}
export function respondPluginConfigSave(configs: { [x: string]: any }): PluginConfigSaveResponseAction {
	return {
		type: TypeKeys.CONFIG_SAVE_RESPONSE,
		configs,
	}
}

export type PluginAction = PluginConfigRequestAction | PluginConfigResponseAction |
	PluginConfigSaveRequestAction | PluginConfigSaveResponseAction
