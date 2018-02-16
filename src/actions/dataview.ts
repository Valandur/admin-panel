import { IdFunction, Error, DataObject } from "../types"
import { Action } from "redux"

export enum TypeKeys {
	LIST_REQUEST = "DATA_LIST_REQUEST",
	LIST_RESPONSE = "DATA_LIST_RESPONSE",
	DETAILS_REQUEST = "DATA_DETAILS_REQUEST",
	DETAILS_RESPONSE = "DATA_DETAILS_RESPONSE",
	CREATE_REQUEST = "DATA_CREATE_REQUEST",
	CREATE_RESPONSE = "DATA_CREATE_RESPONSE",
	CHANGE_REQUEST = "DATA_CHANGE_REQUEST",
	CHANGE_RESPONSE = "DATA_CHANGE_RESPONSE",
	DELETE_REQUEST = "DATA_DELETE_REQUEST",
	DELETE_RESPONSE = "DATA_DELETE_RESPONSE",
	SET_FILTER = "DATA_SET_FILTER",
}

export interface BaseAction<T extends DataObject> extends Action {
	endpoint: string
	id: IdFunction<T>
}

export interface ListRequestAction extends Action {
	type: TypeKeys.LIST_REQUEST
	endpoint: string
	details: boolean
}
export function requestList(
		endpoint: string, details: boolean = false): ListRequestAction {
	return {
		type: TypeKeys.LIST_REQUEST,
		endpoint,
		details,
	}
}

export interface ListResponseAction<T extends DataObject> extends Action {
	type: TypeKeys.LIST_RESPONSE
	endpoint: string
	list?: T[]
	err?: Error
}
export function respondList<T extends DataObject>(
		endpoint: string, list?: T[], err?: Error): ListResponseAction<T> {
	return {
		type: TypeKeys.LIST_RESPONSE,
		endpoint,
		list,
		err,
	}
}

export interface DetailsRequestAction<T extends DataObject> extends BaseAction<T> {
	type: TypeKeys.DETAILS_REQUEST
	data: T
}
export function requestDetails<T extends DataObject>(
		endpoint: string, id: IdFunction<T>, data: T): DetailsRequestAction<T> {
	return {
		type: TypeKeys.DETAILS_REQUEST,
		endpoint,
		id,
		data,
	}
}

export interface CreateRequestAction<T extends DataObject> extends BaseAction<T> {
	type: TypeKeys.CREATE_REQUEST
	data: T
}
export function requestCreate<T extends DataObject>(
		endpoint: string, id: IdFunction<T>, data: T): CreateRequestAction<T> {
	return {
		type: TypeKeys.CREATE_REQUEST,
		endpoint,
		id,
		data,
	}
}

export interface CreateResponseAction<T extends DataObject> extends BaseAction<T> {
	type: TypeKeys.CREATE_RESPONSE
	data?: T
	err?: Error
}
export function respondCreate<T extends DataObject>(
		endpoint: string, id: IdFunction<T>, data?: T, err?: Error): CreateResponseAction<T> {
	return {
		type: TypeKeys.CREATE_RESPONSE,
		endpoint,
		id,
		data,
		err,
	}
}

export interface DetailsResponseAction<T extends DataObject> extends BaseAction<T> {
	type: TypeKeys.DETAILS_RESPONSE
	data: T
	err?: Error
}
export function respondDetails<T extends DataObject>(
		endpoint: string, id: IdFunction<T>, data: T, err?: Error): DetailsResponseAction<T> {
	return {
		type: TypeKeys.DETAILS_RESPONSE,
		endpoint,
		id,
		data,
		err,
	}
}

export interface ChangeRequestAction<T extends DataObject> extends BaseAction<T> {
	type: TypeKeys.CHANGE_REQUEST
	data: T
	newData: any
}
export function requestChange<T extends DataObject>(
		endpoint: string, id: IdFunction<T>, data: T, newData: any): ChangeRequestAction<T> {
	return {
		type: TypeKeys.CHANGE_REQUEST,
		endpoint,
		id,
		data,
		newData,
	}
}

export interface ChangeResponseAction<T extends DataObject> extends BaseAction<T> {
	type: TypeKeys.CHANGE_RESPONSE
	data: T
	err?: Error
}
export function respondChange<T extends DataObject>(
		endpoint: string, id: IdFunction<T>, data: T, err?: Error): ChangeResponseAction<T> {
	return {
		type: TypeKeys.CHANGE_RESPONSE,
		endpoint,
		id,
		data,
		err,
	}
}

export interface DeleteRequestAction<T extends DataObject> extends BaseAction<T> {
	type: TypeKeys.DELETE_REQUEST
	data: T
}
export function requestDelete<T extends DataObject>(
		endpoint: string, id: IdFunction<T>, data: T): DeleteRequestAction<T> {
	return {
		type: TypeKeys.DELETE_REQUEST,
		endpoint,
		id,
		data,
	}
}

export interface DeleteResponseAction<T extends DataObject> extends BaseAction<T> {
	type: TypeKeys.DELETE_RESPONSE
	data: T
	err?: Error
}
export function respondDelete<T extends DataObject>(
		endpoint: string, id: IdFunction<T>, data: T, err?: Error): DeleteResponseAction<T> {
	return {
		type: TypeKeys.DELETE_RESPONSE,
		endpoint,
		id,
		data,
		err,
	}
}

export interface SetFilterAction extends Action {
	type: TypeKeys.SET_FILTER
	endpoint: string
	filter: string
	value: string
}
export function setFilter(endpoint: string, filter: string, value: string): SetFilterAction {
	return {
		type: TypeKeys.SET_FILTER,
		endpoint,
		filter,
		value,
	}
}

export type DataViewAction<T extends DataObject> = ListRequestAction | ListResponseAction<T> |
	DetailsRequestAction<T> | DetailsResponseAction<T> | CreateRequestAction<T> | CreateResponseAction<T> |
	ChangeRequestAction<T> | ChangeResponseAction<T> | DeleteRequestAction<T> | DeleteResponseAction<T> | SetFilterAction
