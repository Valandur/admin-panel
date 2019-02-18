import { AppAction } from '../actions';
import { TypeKeys } from '../actions/preferences';
import i18n from '../services/i18n';
import { Lang, PreferenceKey, Theme } from '../types';

declare const swapThemeCss: (theme: Theme) => void;

export interface PreferencesState {
	[PreferenceKey.lang]: Lang;
	[PreferenceKey.theme]: Theme;
	[PreferenceKey.showServerUsage]: boolean;
	[PreferenceKey.hideWIPNote]: boolean;
	[PreferenceKey.hidePluginsNote]: boolean;
	[PreferenceKey.hideServerSettingsNote]: boolean;
	version: number;
}

let initialState: PreferencesState = {
	lang: Lang.EN,
	theme: Theme.default,
	showServerUsage: true,
	hideWIPNote: false,
	hidePluginsNote: false,
	hideServerSettingsNote: false,
	version: 4
};

if (window.localStorage) {
	const str = window.localStorage.getItem('preferences');
	const prevApi: PreferencesState | undefined = str
		? JSON.parse(str)
		: undefined;
	if (prevApi && prevApi.version === initialState.version) {
		initialState = { ...initialState, ...prevApi };
	}
}

export default (state = initialState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.SET_PREFERENCE:
			if (action.key === PreferenceKey.theme) {
				swapThemeCss(action.value);
			} else if (action.key === PreferenceKey.lang) {
				i18n.changeLanguage(action.value);
			}

			return {
				...state,
				[action.key]: action.value
			};

		default:
			return state;
	}
};
