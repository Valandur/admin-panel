export const EXECUTE_REQUEST = "EXECUTE_REQUEST"
export const EXECUTE_RESPONSE = "EXECUTE_RESPONSE"
export function requestExecute(cmd, waitLines, waitTime) {
	return {
		type: EXECUTE_REQUEST,
		command: cmd,
		waitLines: waitLines,
		waitTime: waitTime,
	}
}
