import { Action } from "redux"

import { PreferenceKey } from "../types"

export enum TypeKeys {
	SET_PREFERENCE = "SET_PREFERENCE"
}

export interface SetPreferenceAction extends Action {
	type: TypeKeys.SET_PREFERENCE
	key: PreferenceKey
	value: any
}
export function setPreference(
	key: PreferenceKey,
	value: any
): SetPreferenceAction {
	return {
		type: TypeKeys.SET_PREFERENCE,
		key,
		value
	}
}

export type PreferencesAction = SetPreferenceAction
