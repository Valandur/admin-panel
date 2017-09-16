import _ from "lodash"

import {
	TICKET_SET_FILTER, TICKETS_RESPONSE,
	TICKET_CHANGE_REQUEST, TICKET_CHANGE_RESPONSE
} from "../actions/mmctickets"

const mmctickets = (state = { tickets: [], ticketFilter: {}}, action) => {
	switch(action.type) {
		case TICKETS_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				tickets: _.sortBy(action.tickets, "id"),
			})

		case TICKET_SET_FILTER:
			return _.assign({}, state, {
				ticketFilter: {
					...state.filter,
					[action.filter]: action.value,
				}
			});

		case TICKET_CHANGE_REQUEST:
			return _.assign({}, state, {
				tickets: _.map(state.tickets, t => {
					if (t.id !== action.ticket.id) return t;
					return _.assign({}, t, { updating: true })
				})
			})

		case TICKET_CHANGE_RESPONSE:
			return _.assign({}, state, {
				tickets: _.map(state.tickets, t => {
					if (t.id !== action.ticket.id) return t;
					return _.assign({}, t, action.ok ? action.ticket : null, { updating: false })
				})
			})

		default:
			return state;
	}
}

export default mmctickets
