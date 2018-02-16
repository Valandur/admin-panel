import * as _ from "lodash"

import { TypeKeys } from "../actions/settings"
import { AppAction } from "../actions"
import { ServerProp } from "../types"

export interface SettingsState {
	properties: ServerProp[]
}

const initialState: SettingsState = {
	properties: []
}

const toPropItem = (value: string, key: string): ServerProp => ({ key, value })

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
				properties: _.map(action.properties, (value, key) => {
					const prop = toPropItem(value, key)

					const orig = _.find(state.properties, { key: prop.key })
					if (prop.key !== action.key) {
						return _.assign({}, orig, prop)
					}
					return _.assign({}, orig, prop, {
						saving: false,
						edit: false,
					})
				})
			})

		default:
			return state
	}
}
