import _ from "lodash"

import { OPERATIONS_RESPONSE, OPERATION_PAUSE_RESPONSE, OPERATION_STOP_RESPONSE } from "../actions/operations"

const operations = (state = { operations: []}, action) => {
	switch(action.type) {
		case OPERATIONS_RESPONSE:
			return _.assign({}, state, {
				operations: _.sortBy(action.operations, "uuid"),
			});

		case OPERATION_PAUSE_RESPONSE:
		case OPERATION_STOP_RESPONSE:
			return _.assign({}, state, {
				operations: _.map(state.operations, op => {
					if (op.uuid !== action.operation.uuid) return op;
					return _.assign({}, op, action.operation);
				})
			})

		default:
			return state;
	}
}

export default operations
