import * as _ from "lodash"

import { AppAction } from "../actions"
import { TypeKeys } from "../actions/settings"
import { EServerProperty } from "../types"

import { DataViewState } from "./dataview"

export interface SettingsState extends DataViewState<EServerProperty> {
	properties: EServerProperty[]
}

const initialState: SettingsState = {
	creating: false,
	filter: {},
	list: [],
	properties: [],
}

export default (state = initialState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.EDIT_PROPERTY:
			return _.assign({}, state, {
				properties: _.map(state.properties, prop => {
					if (prop.key !== action.prop.key) {
						return prop
					}
					return _.assign({}, prop, {
						edit: !prop.edit,
					})
				})
			})

		case TypeKeys.SET_PROPERTY:
			return _.assign({}, state, {
				properties: _.map(state.properties, prop => {
					if (prop.key !== action.prop.key) {
						return prop
					}
					return _.assign({}, prop, {
						value: action.value,
					})
				})
			})

		case TypeKeys.SAVE_PROPERTY_REQUEST:
			return _.assign({}, state, {
				properties: _.map(state.properties, prop => {
					if (prop.key !== action.prop.key) {
						return prop
					}
					return _.assign({}, prop, {
						saving: true,
					})
				})
			})

		case TypeKeys.SAVE_PROPERTY_RESPONSE:
			return _.assign({}, state, {
				properties: _.map(state.properties, prop => {
					if (prop.key !== action.key) {
						return prop
					}
					return _.assign({}, prop, {
						saving: false,
						edit: false,
					})
				})
			})

		default:
			return state
	}
}
