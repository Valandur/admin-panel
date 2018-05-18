import { Action } from 'redux';

import { ServerInfo, ServerStats } from '../fetch';

export enum TypeKeys {
	INFO_REQUEST = 'INFO_REQUEST',
	INFO_RESPONSE = 'INFO_RESPONSE',
	STATS_REQUEST = 'STATS_REQUEST',
	STATS_RESPONSE = 'STATS_RESPONSE'
}

export interface InfoRequestAction extends Action {
	type: TypeKeys.INFO_REQUEST;
}
export function requestInfo(): InfoRequestAction {
	return {
		type: TypeKeys.INFO_REQUEST
	};
}

export interface InfoResponseAction extends Action {
	type: TypeKeys.INFO_RESPONSE;
	data: ServerInfo;
}
export function respondInfo(data: ServerInfo): InfoResponseAction {
	return {
		type: TypeKeys.INFO_RESPONSE,
		data: data
	};
}

export interface StatsRequestAction extends Action {
	type: TypeKeys.STATS_REQUEST;
	limit?: number;
}
export function requestStats(limit?: number): StatsRequestAction {
	return {
		type: TypeKeys.STATS_REQUEST,
		limit
	};
}

export interface StatsResponseAction extends Action, ServerStats {
	type: TypeKeys.STATS_RESPONSE;
}
export function respondStats(stats: ServerStats): StatsResponseAction {
	return {
		type: TypeKeys.STATS_RESPONSE,
		tps: stats.tps,
		players: stats.players,
		cpu: stats.cpu,
		memory: stats.memory,
		disk: stats.disk
	};
}

export type DashboardAction =
	| InfoRequestAction
	| InfoResponseAction
	| StatsRequestAction
	| StatsResponseAction;
