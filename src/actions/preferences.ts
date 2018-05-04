import { Action } from "redux"

import { Lang, PreferenceKey } from "../types"

export enum TypeKeys {
	CHANGE_LANGUAGE = "CHANGE_LANGUAGE",
	SET_PREFERENCE = "SET_PREFERENCE"
}

export interface ChangeLanguageAction extends Action {
	type: TypeKeys.CHANGE_LANGUAGE
	lang: Lang
}
export function changeLanguage(lang: Lang): ChangeLanguageAction {
	return {
		type: TypeKeys.CHANGE_LANGUAGE,
		lang: lang
	}
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

export type PreferencesAction = ChangeLanguageAction | SetPreferenceAction
