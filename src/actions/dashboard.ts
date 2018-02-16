import { Action } from "redux"
import { ServerStat, InfoData } from "../types"

export enum TypeKeys {
	INFO_REQUEST = "INFO_REQUEST",
	INFO_RESPONSE = "INFO_RESPONSE",
	STATS_REQUEST = "STATS_REQUEST",
	STATS_RESPONSE = "STATS_RESPONSE",
}

export interface InfoRequestAction extends Action {
	type: TypeKeys.INFO_REQUEST
}
export function requestInfo(): InfoRequestAction {
	return {
		type: TypeKeys.INFO_REQUEST
	}
}

export interface InfoResponseAction extends Action {
	type: TypeKeys.INFO_RESPONSE
	data: InfoData
}
export function respondInfo(data: InfoData): InfoResponseAction {
	return {
		type: TypeKeys.INFO_RESPONSE,
		data: data,
	}
}

export interface StatsRequestAction extends Action {
	type: TypeKeys.STATS_REQUEST
}
export function requestStats() {
	return {
		type: TypeKeys.STATS_REQUEST
	}
}

export interface StatsResponseAction extends Action {
	type: TypeKeys.STATS_RESPONSE
	tps: ServerStat[]
	players: ServerStat[]
	cpu: ServerStat[]
	memory: ServerStat[]
	disk: ServerStat[]
}
export function respondStats(
			tps: ServerStat[], players: ServerStat[], cpu: ServerStat[],
			memory: ServerStat[], disk: ServerStat[]): StatsResponseAction {
	return {
		type: TypeKeys.STATS_RESPONSE,
		tps: tps,
		players: players,
		cpu: cpu,
		memory: memory,
		disk: disk,
	}
}

export type DashboardAction = InfoRequestAction | InfoResponseAction | StatsRequestAction | StatsResponseAction
