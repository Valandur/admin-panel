import { Action } from "redux"

import { EServerProperty } from "../types"

export enum TypeKeys {
	EDIT_PROPERTY = "EDIT_PROPERTY",
	SET_PROPERTY = "SET_PROPERTY",
	SAVE_PROPERTY_REQUEST = "SAVE_PROPERTY_REQUEST",
	SAVE_PROPERTY_RESPONSE = "SAVE_PROPERTY_RESPONSE",
}

export interface EditPropertyAction extends Action {
	type: TypeKeys.EDIT_PROPERTY
	prop: EServerProperty
}
export function editProperty(prop: EServerProperty): EditPropertyAction {
	return {
		type: TypeKeys.EDIT_PROPERTY,
		prop,
	}
}

export interface SetPropertyAction extends Action {
	type: TypeKeys.SET_PROPERTY
	prop: EServerProperty
	value: string
}
export function setProperty(prop: EServerProperty, value: string): SetPropertyAction {
	return {
		type: TypeKeys.SET_PROPERTY,
		prop,
		value,
	}
}

export interface SavePropertyRequestAction extends Action {
	type: TypeKeys.SAVE_PROPERTY_REQUEST
	prop: EServerProperty
}
export function requestSaveProperty(prop: EServerProperty): SavePropertyRequestAction {
	return {
		type: TypeKeys.SAVE_PROPERTY_REQUEST,
		prop,
	}
}

export interface SavePropertyResponseAction extends Action {
	type: TypeKeys.SAVE_PROPERTY_RESPONSE
	key: string
	value: string
}
export function respondSaveProperty(key: string, value: string): SavePropertyResponseAction {
	return {
		type: TypeKeys.SAVE_PROPERTY_RESPONSE,
		key,
		value,
	}
}

export type SettingsAction = EditPropertyAction | SetPropertyAction | SavePropertyRequestAction |
	SavePropertyResponseAction
