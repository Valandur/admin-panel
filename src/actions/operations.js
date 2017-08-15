export const OPERATION_REQUEST = "OPERATION_REQUEST"
export const OPERATION_RESPONSE = "OPERATION_RESPONSE"
export function requestOperation(uuid, details = false) {
	return {
		type: OPERATION_REQUEST,
		uuid: uuid,
	}
}

export const OPERATIONS_REQUEST = "OPERATIONS_REQUEST"
export const OPERATIONS_RESPONSE = "OPERATIONS_RESPONSE"
export function requestOperations(details = false) {
	return {
		type: OPERATIONS_REQUEST,
		details: details,
	}
}

export const OPERATION_CREATE_REQUEST = "OPERATION_CREATE_REQUEST"
export const OPERATION_CREATE_RESPONSE = "OPERATION_CREATE_RESPONSE"
export function requestCreateOperation(operation) {
	return {
		type: OPERATION_CREATE_REQUEST,
		operation: operation,
	}
}

export const OPERATION_PAUSE_REQUEST = "OPERATION_PAUSE_REQUEST"
export const OPERATION_PAUSE_RESPONSE = "OPERATION_PAUSE_RESPONSE"
export function requestPause(operation, pause) {
	return {
		type: OPERATION_PAUSE_REQUEST,
		operation: operation,
		pause: pause,
	}
}

export const OPERATION_STOP_REQUEST = "OPERATION_STOP_REQUEST"
export const OPERATION_STOP_RESPONSE = "OPERATION_STOP_RESPONSE"
export function requestStop(operation) {
	return {
		type: OPERATION_STOP_REQUEST,
		operation: operation,
	}
}
