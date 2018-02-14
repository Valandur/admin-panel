import * as _ from "lodash"
import { Action } from "redux"

import { EDIT_PROPERTY, SET_PROPERTY } from "../actions/settings"
import { SAVE_PROPERTY_REQUEST, SAVE_PROPERTY_RESPONSE } from "../actions/settings"

const toPropItem = (value: string, key: string) => ({ key, value })

const settings = (state = { properties: []}, action: Action) => {
	switch(action.type) {
		case EDIT_PROPERTY:
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

		case SET_PROPERTY:
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

		case SAVE_PROPERTY_REQUEST:
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

		case SAVE_PROPERTY_RESPONSE:
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

export default settings
