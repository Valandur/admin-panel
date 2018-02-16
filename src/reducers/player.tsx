import * as _ from "lodash"

import { TypeKeys } from "../actions/player"
import { AppAction } from "../actions"
import { Player } from "../types"
import { DataViewState } from "./dataview"

const initialState: DataViewState<Player> = {
	creating: false,
	filter: {},
	list: [],
}

export default (state = initialState, action: AppAction) => {
	switch (action.type) {
		case TypeKeys.KICK_REQUEST:
			return _.assign({}, state, {
				list: _.map(state.list, p => {
					if (p.uuid !== action.player.uuid) {
						return p
					}
					return _.assign({}, p, { updating: true })
				})
			})

		case TypeKeys.KICK_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					list: _.map(state.list, p => {
						if (p.uuid !== action.player.uuid) {
							return p
						}
						return _.assign({}, p, { updating: false })
					})
				})
			}
			return _.assign({}, state, {
				list: _.filter(state.list, p => p.uuid !== action.player.uuid)
			})

		case TypeKeys.BAN_REQUEST:
			return _.assign({}, state, {
				list: _.map(state.list, p => {
					if (p.uuid !== action.player.uuid) {
						return p
					}
					return _.assign({}, p, { updating: true })
				})
			})

		case TypeKeys.BAN_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					list: _.map(state.list, p => {
						if (p.uuid !== action.player.uuid) {
							return p
						}
						return _.assign({}, p, { updating: false })
					})
				})
			}
			return _.assign({}, state, {
				list: _.filter(state.list, p => p.uuid !== action.player.uuid)
			})

		default:
			return state
	}
}
