export const BOOKS_REQUEST = "WEBBOOKS_BOOKS_REQUEST"
export const BOOKS_RESPONSE = "WEBBOOKS_BOOKS_RESPONSE"
export function requestBooks(details = false) {
	return {
		type: BOOKS_REQUEST,
		details: details,
	}
}

export const BOOK_CREATE_REQUEST = "WEBBOOKS_BOOK_CREATE_REQUEST"
export const BOOK_CREATE_RESPONSE = "WEBBOOKS_BOOK_CREATE_RESPONSE"
export function requestCreateBook(data) {
	return {
		type: BOOK_CREATE_REQUEST,
		data: data,
	}
}

export const BOOK_CHANGE_REQUEST = "WEBBOOKS_BOOK_CHANGE_REQUEST"
export const BOOK_CHANGE_RESPONSE = "WEBBOOKS_BOOK_CHANGE_RESPONSE"
export function requestChangeBook(book, data) {
	return {
		type: BOOK_CHANGE_REQUEST,
		book: book,
		data: data,
	}
}

export const BOOK_DELETE_REQUEST = "WEBBOOKS_BOOK_DELETE_REQUEST"
export const BOOK_DELETE_RESPONSE = "WEBBOOKS_BOOK_DELETE_RESPONSE"
export function requestDeleteBook(book) {
	return {
		type: BOOK_DELETE_REQUEST,
		book: book,
	}
}

export const BOOK_SET_FILTER = "WEBBOOKS_BOOK_SET_FILTER"
export function setBookFilter(filter, value) {
	return {
		type: BOOK_SET_FILTER,
		filter: filter,
		value: value,
	}
}
