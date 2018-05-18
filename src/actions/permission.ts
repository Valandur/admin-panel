import { Action } from 'redux';

import { Subject, SubjectCollection } from '../fetch';

export enum TypeKeys {
	COLLECTIONS_LIST_REQUEST = 'PERMISSION_COLLECTIONS_LIST_REQUEST',
	COLLECTIONS_LIST_RESPONSE = 'PERMISSION_COLLECTIONS_LIST_RESPONSE',
	SUBJECTS_LIST_REQUEST = 'PERMISSION_SUBJECTS_LIST_REQUEST',
	SUBJECTS_LIST_RESPONSE = 'PERMISSION_SUBJECTS_LIST_RESPONSE'
}

export interface CollectionsListRequestAction extends Action {
	type: TypeKeys.COLLECTIONS_LIST_REQUEST;
}
export function requestCollections(): CollectionsListRequestAction {
	return {
		type: TypeKeys.COLLECTIONS_LIST_REQUEST
	};
}

export interface CollectionsListResponseAction extends Action {
	type: TypeKeys.COLLECTIONS_LIST_RESPONSE;
	collections: SubjectCollection[];
}
export function respondCollections(
	collections: SubjectCollection[]
): CollectionsListResponseAction {
	return {
		type: TypeKeys.COLLECTIONS_LIST_RESPONSE,
		collections: collections
	};
}

export interface SubjectsListRequestAction extends Action {
	type: TypeKeys.SUBJECTS_LIST_REQUEST;
	collection: SubjectCollection;
}
export function requestSubjects(
	collection: SubjectCollection
): SubjectsListRequestAction {
	return {
		type: TypeKeys.SUBJECTS_LIST_REQUEST,
		collection: collection
	};
}

export interface SubjectsListResponseAction extends Action {
	type: TypeKeys.SUBJECTS_LIST_RESPONSE;
	collection: SubjectCollection;
	subjects: Subject[];
}
export function respondSubjects(
	collection: SubjectCollection,
	subjects: Subject[]
): SubjectsListResponseAction {
	return {
		type: TypeKeys.SUBJECTS_LIST_RESPONSE,
		collection: collection,
		subjects: subjects
	};
}

export type PermissionAction =
	| CollectionsListRequestAction
	| CollectionsListResponseAction
	| SubjectsListRequestAction
	| SubjectsListResponseAction;
