import * as i18next from "i18next"

import { AppAction } from "../actions"
import { TypeKeys } from "../actions/preferences"
import { Lang, PreferenceKey } from "../types"

export interface PreferencesState {
	lang: Lang
	[PreferenceKey.showServerUsage]: boolean
	[PreferenceKey.hideWIPNote]: boolean
	[PreferenceKey.hidePluginsNote]: boolean
	[PreferenceKey.hideServerSettingsNote]: boolean
	version: number
}

let initialState: PreferencesState = {
	lang: Lang.EN,
	showServerUsage: true,
	hideWIPNote: false,
	hidePluginsNote: false,
	hideServerSettingsNote: false,
	version: 2
}

if (window.localStorage) {
	const str = window.localStorage.getItem("preferences")
	const prevApi: PreferencesState | undefined = str
		? JSON.parse(str)
		: undefined
	if (prevApi && prevApi.version === initialState.version) {
		initialState = { ...initialState, ...prevApi }
	}
}

export default (state = initialState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.CHANGE_LANGUAGE:
			i18next.changeLanguage(action.lang)
			return {
				...state,
				lang: action.lang
			}

		case TypeKeys.SET_PREFERENCE:
			return {
				...state,
				[action.key]: action.value
			}

		default:
			return state
	}
}
