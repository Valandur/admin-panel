import { Action } from "redux"

import { Player } from "../fetch"

export enum TypeKeys {
	KICK_REQUEST = "PLAYER_KICK_REQUEST",
	KICK_RESPONSE = "PLAYER_KICK_RESPONSE",
	BAN_REQUEST = "PLAYER_BAN_REQUEST",
	BAN_RESPONSE = "PLAYER_BAN_RESPONSE",
}

export interface KickPlayerRequestAction extends Action {
	type: TypeKeys.KICK_REQUEST
	player: Player
}
export function requestKickPlayer(player: Player): KickPlayerRequestAction {
	return {
		type: TypeKeys.KICK_REQUEST,
		player: player,
	}
}

export interface KickPlayerResponseAction extends Action {
	type: TypeKeys.KICK_RESPONSE
	ok: boolean
	player: Player
}
export function respondKickPlayer(ok: boolean, player: Player): KickPlayerResponseAction {
	return {
		type: TypeKeys.KICK_RESPONSE,
		ok,
		player,
	}
}

export interface BanPlayerRequestAction extends Action {
	type: TypeKeys.BAN_REQUEST
	player: Player
}
export function requestBanPlayer(player: Player): BanPlayerRequestAction {
	return {
		type: TypeKeys.BAN_REQUEST,
		player: player,
	}
}

export interface BanPlayerResponseAction extends Action {
	type: TypeKeys.BAN_RESPONSE
	ok: boolean
	player: Player
	response: string
}
export function respondBanPlayer(ok: boolean, player: Player, response: string): BanPlayerResponseAction {
	return {
		type: TypeKeys.BAN_RESPONSE,
		ok,
		player,
		response
	}
}

export type PlayerAction = KickPlayerRequestAction | KickPlayerResponseAction | BanPlayerRequestAction |
	BanPlayerResponseAction
