import _ from "lodash"

import {
	TICKET_SET_FILTER, TICKETS_RESPONSE,
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

		default:
			return state;
	}
}

export default mmctickets
