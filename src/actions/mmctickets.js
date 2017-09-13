export const TICKETS_REQUEST = "MMCTICKETS_TICKETS_REQUEST"
export const TICKETS_RESPONSE = "MMCTICKETS_TICKETS_RESPONSE"
export function requestTickets(details = false) {
	return {
		type: TICKETS_REQUEST,
		details: details,
	}
}

export const TICKET_SET_FILTER = "MMCTICKETS_TICKET_SET_FILTER"
export function setTicketFilter(filter, value) {
	return {
		type: TICKET_SET_FILTER,
		filter: filter,
		value: value,
	}
}
