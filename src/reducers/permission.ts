import { AppAction } from '../actions';
import { TypeKeys } from '../actions/permission';
import { Subject, SubjectCollection } from '../fetch';

export interface PermissionState {
	collections: SubjectCollection[];
	subjects: Subject[];
}

const defaultState: PermissionState = {
	collections: [],
	subjects: [],
};

export default (state = defaultState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.COLLECTIONS_LIST_RESPONSE:
			return {
				...state,
				collections: action.collections,
			};

		case TypeKeys.SUBJECTS_LIST_RESPONSE:
			return {
				...state,
				collection: action.collection,
				subjects: action.subjects,
			};

		default:
			return state;
	}
};
