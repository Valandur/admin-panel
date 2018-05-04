import { Action } from "redux"

import { ExecuteCommandResponse } from "../fetch"

export enum TypeKeys {
	EXECUTE_REQUEST = "EXECUTE_REQUEST",
	EXECUTE_RESPONSE = "EXECUTE_RESPONSE"
}

export interface ExecuteRequestAction extends Action {
	type: TypeKeys.EXECUTE_REQUEST
	command: string
	waitLines: number
	waitTime: number
}
export function requestExecute(
	cmd: string,
	waitLines: number,
	waitTime: number
): ExecuteRequestAction {
	return {
		type: TypeKeys.EXECUTE_REQUEST,
		command: cmd,
		waitLines: waitLines,
		waitTime: waitTime
	}
}

export interface ExecuteResponseAction extends Action {
	type: TypeKeys.EXECUTE_RESPONSE
	response: ExecuteCommandResponse
}
export function respondExecute(
	response: ExecuteCommandResponse
): ExecuteResponseAction {
	return {
		type: TypeKeys.EXECUTE_RESPONSE,
		response
	}
}

export type CommandAction = ExecuteRequestAction | ExecuteResponseAction
