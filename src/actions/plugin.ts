import { Action } from "redux"
import { PluginContainer } from "../fetch"

export enum TypeKeys {
	CONFIG_REQUEST = "PLUGIN_CONFIG_REQUEST",
	CONFIG_RESPONSE = "PLUGIN_CONFIG_RESPONSE",
	CONFIG_SET = "PLUGIN_CONFIG_SET",
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
	configs: object[]
}
export function respondPluginConfig(configs: object[]): PluginConfigResponseAction {
	return {
		type: TypeKeys.CONFIG_RESPONSE,
		configs,
	}
}

export interface SetPluginConfigAction extends Action {
	type: TypeKeys.CONFIG_SET
	name: string
	conf: object
}
export function setPluginConfig(name: string, conf: object): SetPluginConfigAction {
	return {
		type: TypeKeys.CONFIG_SET,
		name: name,
		conf: conf,
	}
}

export interface PluginConfigSaveRequestAction extends Action {
	type: TypeKeys.CONFIG_SAVE_REQUEST
	id: string
	plugin: PluginContainer
	configs: object[]
}
export function requestPluginConfigSave(id: string, plugin: PluginContainer, configs: object[]):
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
	configs: object[]
}
export function respondPluginConfigSave(configs: object[]): PluginConfigSaveResponseAction {
	return {
		type: TypeKeys.CONFIG_SAVE_RESPONSE,
		configs,
	}
}

export type PluginAction = PluginConfigRequestAction | PluginConfigResponseAction | SetPluginConfigAction |
	PluginConfigSaveRequestAction | PluginConfigSaveResponseAction
