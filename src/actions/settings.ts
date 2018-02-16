import { Action } from "redux"
import { ServerProp } from "../types"

export enum TypeKeys {
	EDIT_PROPERTY = "EDIT_PROPERTY",
	SET_PROPERTY = "SET_PROPERTY",
	SAVE_PROPERTY_REQUEST = "SAVE_PROPERTY_REQUEST",
	SAVE_PROPERTY_RESPONSE = "SAVE_PROPERTY_RESPONSE",
}

export interface EditPropertyAction extends Action {
	type: TypeKeys.EDIT_PROPERTY
	prop: ServerProp
}
export function editProperty(prop: ServerProp): EditPropertyAction {
	return {
		type: TypeKeys.EDIT_PROPERTY,
		prop,
	}
}

export interface SetPropertyAction extends Action {
	type: TypeKeys.SET_PROPERTY
	prop: ServerProp
	value: string
}
export function setProperty(prop: ServerProp, value: string): SetPropertyAction {
	return {
		type: TypeKeys.SET_PROPERTY,
		prop,
		value,
	}
}

export interface SavePropertyRequestAction extends Action {
	type: TypeKeys.SAVE_PROPERTY_REQUEST
	prop: ServerProp
}
export function requestSaveProperty(prop: ServerProp): SavePropertyRequestAction {
	return {
		type: TypeKeys.SAVE_PROPERTY_REQUEST,
		prop,
	}
}

export interface SavePropertyResponseAction extends Action {
	type: TypeKeys.SAVE_PROPERTY_RESPONSE
	key: string
	properties: {
		[x: string]: string
	}
}
export function respondSaveProperty(key: string, properties: { [x: string]: string }): SavePropertyResponseAction {
	return {
		type: TypeKeys.SAVE_PROPERTY_RESPONSE,
		key,
		properties,
	}
}

export type SettingsAction = EditPropertyAction | SetPropertyAction | SavePropertyRequestAction |
	SavePropertyResponseAction
