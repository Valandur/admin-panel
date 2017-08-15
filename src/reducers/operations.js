import _ from "lodash"

import {
	OPERATION_RESPONSE,
	OPERATIONS_RESPONSE,
	OPERATION_CREATE_RESPONSE,
	OPERATION_PAUSE_RESPONSE,
	OPERATION_STOP_RESPONSE
} from "../actions/operations"

const operations = (state = { operations: []}, action) => {
	if (!action.ok)
		return state;
	
	switch(action.type) {
		case OPERATION_RESPONSE:
			return _.assign({}, state, {
				operation: action.operation,
			});

		case OPERATIONS_RESPONSE:
			return _.assign({}, state, {
				operations: _.sortBy(action.operations, "uuid"),
			});

		case OPERATION_CREATE_RESPONSE:
			return _.assign({}, state, {
				operations: _.sortBy(_.concat(state.operations, action.operation), "uuid"),
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
