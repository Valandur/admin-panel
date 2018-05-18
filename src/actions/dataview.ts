import { Action } from 'redux';
import { ResponseError } from 'superagent';

import { IdFunction } from '../types';

export enum TypeKeys {
	LIST_REQUEST = 'DATA_LIST_REQUEST',
	LIST_RESPONSE = 'DATA_LIST_RESPONSE',
	DETAILS_REQUEST = 'DATA_DETAILS_REQUEST',
	DETAILS_RESPONSE = 'DATA_DETAILS_RESPONSE',
	CREATE_REQUEST = 'DATA_CREATE_REQUEST',
	CREATE_RESPONSE = 'DATA_CREATE_RESPONSE',
	CHANGE_REQUEST = 'DATA_CHANGE_REQUEST',
	CHANGE_RESPONSE = 'DATA_CHANGE_RESPONSE',
	DELETE_REQUEST = 'DATA_DELETE_REQUEST',
	DELETE_RESPONSE = 'DATA_DELETE_RESPONSE',
	SET_FILTER = 'DATA_SET_FILTER'
}

export interface BaseAction<T> extends Action {
	endpoint: string;
	id: IdFunction<T>;
}

export interface ListRequestAction extends Action {
	type: TypeKeys.LIST_REQUEST;
	endpoint: string;
	details: boolean;
	query: {
		[x: string]: string;
	};
}
export function requestList(
	endpoint: string,
	details: boolean = false,
	query: { [x: string]: string } = {}
): ListRequestAction {
	return {
		type: TypeKeys.LIST_REQUEST,
		endpoint,
		details,
		query
	};
}

export interface ListResponseAction<T> extends Action {
	type: TypeKeys.LIST_RESPONSE;
	endpoint: string;
	list?: T[];
	err?: ResponseError;
}
export function respondList<T>(
	endpoint: string,
	list?: T[],
	err?: ResponseError
): ListResponseAction<T> {
	return {
		type: TypeKeys.LIST_RESPONSE,
		endpoint,
		list,
		err
	};
}

export interface DetailsRequestAction<T> extends BaseAction<T> {
	type: TypeKeys.DETAILS_REQUEST;
	data: T;
}
export function requestDetails<T>(
	endpoint: string,
	id: IdFunction<T>,
	data: T
): DetailsRequestAction<T> {
	return {
		type: TypeKeys.DETAILS_REQUEST,
		endpoint,
		id,
		data
	};
}

export interface CreateRequestAction<T> extends BaseAction<T> {
	type: TypeKeys.CREATE_REQUEST;
	data: T;
}
export function requestCreate<T>(
	endpoint: string,
	id: IdFunction<T>,
	data: T
): CreateRequestAction<T> {
	return {
		type: TypeKeys.CREATE_REQUEST,
		endpoint,
		id,
		data
	};
}

export interface CreateResponseAction<T> extends BaseAction<T> {
	type: TypeKeys.CREATE_RESPONSE;
	data?: T;
	err?: ResponseError;
}
export function respondCreate<T>(
	endpoint: string,
	id: IdFunction<T>,
	data?: T,
	err?: ResponseError
): CreateResponseAction<T> {
	return {
		type: TypeKeys.CREATE_RESPONSE,
		endpoint,
		id,
		data,
		err
	};
}

export interface DetailsResponseAction<T> extends BaseAction<T> {
	type: TypeKeys.DETAILS_RESPONSE;
	data: T;
	err?: ResponseError;
}
export function respondDetails<T>(
	endpoint: string,
	id: IdFunction<T>,
	data: T,
	err?: ResponseError
): DetailsResponseAction<T> {
	return {
		type: TypeKeys.DETAILS_RESPONSE,
		endpoint,
		id,
		data,
		err
	};
}

export interface ChangeRequestAction<T> extends BaseAction<T> {
	type: TypeKeys.CHANGE_REQUEST;
	data: T;
	newData: any;
}
export function requestChange<T>(
	endpoint: string,
	id: IdFunction<T>,
	data: T,
	newData: any
): ChangeRequestAction<T> {
	return {
		type: TypeKeys.CHANGE_REQUEST,
		endpoint,
		id,
		data,
		newData
	};
}

export interface ChangeResponseAction<T> extends BaseAction<T> {
	type: TypeKeys.CHANGE_RESPONSE;
	data: T;
	err?: ResponseError;
}
export function respondChange<T>(
	endpoint: string,
	id: IdFunction<T>,
	data: T,
	err?: ResponseError
): ChangeResponseAction<T> {
	return {
		type: TypeKeys.CHANGE_RESPONSE,
		endpoint,
		id,
		data,
		err
	};
}

export interface DeleteRequestAction<T> extends BaseAction<T> {
	type: TypeKeys.DELETE_REQUEST;
	data: T;
}
export function requestDelete<T>(
	endpoint: string,
	id: IdFunction<T>,
	data: T
): DeleteRequestAction<T> {
	return {
		type: TypeKeys.DELETE_REQUEST,
		endpoint,
		id,
		data
	};
}

export interface DeleteResponseAction<T> extends BaseAction<T> {
	type: TypeKeys.DELETE_RESPONSE;
	data: T;
	err?: ResponseError;
}
export function respondDelete<T>(
	endpoint: string,
	id: IdFunction<T>,
	data: T,
	err?: ResponseError
): DeleteResponseAction<T> {
	return {
		type: TypeKeys.DELETE_RESPONSE,
		endpoint,
		id,
		data,
		err
	};
}

export interface SetFilterAction extends Action {
	type: TypeKeys.SET_FILTER;
	endpoint: string;
	filter: string;
	value: string;
}
export function setFilter(
	endpoint: string,
	filter: string,
	value: string
): SetFilterAction {
	return {
		type: TypeKeys.SET_FILTER,
		endpoint,
		filter,
		value
	};
}

export type DataViewAction<T> =
	| ListRequestAction
	| ListResponseAction<T>
	| DetailsRequestAction<T>
	| DetailsResponseAction<T>
	| CreateRequestAction<T>
	| CreateResponseAction<T>
	| ChangeRequestAction<T>
	| ChangeResponseAction<T>
	| DeleteRequestAction<T>
	| DeleteResponseAction<T>
	| SetFilterAction;
