import { System } from 'react-notification-system';
import { Action } from 'redux';

export enum TypeKeys {
	SAVE_NOTIF_REF = '@@__WEBAPI/SAVE_NOTIF_REF__@@',
	SHOW_NOTIFICATION = 'SHOW_NOTIFICATION'
}

export interface SaveNotifRefAction extends Action {
	type: TypeKeys.SAVE_NOTIF_REF;
	ref: System;
}
export function saveNotifRef(ref: System): SaveNotifRefAction {
	return {
		type: TypeKeys.SAVE_NOTIF_REF,
		ref: ref
	};
}

export interface ShowNotificationAction extends Action {
	type: TypeKeys.SHOW_NOTIFICATION;
	level: 'error' | 'warning' | 'info' | 'success';
	title: string;
	message: string;
}
export type NotifLevel = 'error' | 'warning' | 'info' | 'success';
export function showNotification(
	level: NotifLevel,
	title: string,
	message: string
): ShowNotificationAction {
	return {
		type: TypeKeys.SHOW_NOTIFICATION,
		level: level,
		title: title,
		message: message
	};
}

export type NotificationAction = SaveNotifRefAction | ShowNotificationAction;
