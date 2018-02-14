export const SAVE_NOTIF_REF = "@@__WEBAPI/SAVE_NOTIF_REF__@@"
export function saveNotifRef(ref: HTMLElement) {
	return {
		type: SAVE_NOTIF_REF,
		ref: ref,
	}
}

export const SHOW_NOTIFICATION = "SHOW_NOTIFICATION"
export function showNotification(level: string, title: string, message: string) {
	return {
		type: SHOW_NOTIFICATION,
		level: level,
		title: title,
		message: message,
	}
}
