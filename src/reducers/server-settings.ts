import { AppAction } from "../actions"
import { TypeKeys } from "../actions/server-settings"
import { EServerProperty } from "../types"

import { DataViewState } from "./dataview"

export interface SettingsState extends DataViewState<EServerProperty> {}

const initialState: SettingsState = {
	creating: false,
	filter: {},
	list: []
}

export default (state = initialState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.EDIT_PROPERTY:
			return {
				...state,
				list: state.list.map(prop => {
					if (prop.key !== action.prop.key) {
						return prop
					}
					return {
						...prop,
						edit: !prop.edit
					}
				})
			}

		case TypeKeys.SET_PROPERTY:
			return {
				...state,
				list: state.list.map(prop => {
					if (prop.key !== action.prop.key) {
						return prop
					}
					return {
						...prop,
						value: action.value
					}
				})
			}

		case TypeKeys.SAVE_PROPERTY_REQUEST:
			return {
				...state,
				list: state.list.map(prop => {
					if (prop.key !== action.prop.key) {
						return prop
					}
					return {
						...prop,
						edit: false,
						updating: true
					}
				})
			}

		case TypeKeys.SAVE_PROPERTY_RESPONSE:
			return {
				...state,
				list: state.list.map(prop => {
					if (prop.key !== action.prop.key) {
						return prop
					}
					return {
						...prop,
						value: action.prop.value,
						edit: false,
						updating: false
					}
				})
			}

		default:
			return state
	}
}
