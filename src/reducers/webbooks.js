import _ from "lodash"

import {
	BOOKS_RESPONSE, BOOK_SET_FILTER,
	BOOK_CREATE_REQUEST, BOOK_CREATE_RESPONSE,
	BOOK_CHANGE_REQUEST, BOOK_CHANGE_RESPONSE,
	BOOK_DELETE_REQUEST, BOOK_DELETE_RESPONSE
} from "../actions/webbooks"

const webbooks = (state = { books: [], bookFilter: {}}, action) => {
	switch(action.type) {
		case BOOKS_RESPONSE:
			if (!action.ok)
				return state;

			return _.assign({}, state, {
				books: _.sortBy(action.books, "id"),
			})

		case BOOK_CREATE_REQUEST:
			return _.assign({}, state, {
				bookCreating: true,
			})

		case BOOK_CREATE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					bookCreating: false,
				})
			}

			return _.assign({}, state, {
				bookCreating: false,
				books: _.sortBy(_.concat(state.books, action.book), "id"),
			});

		case BOOK_CHANGE_REQUEST:
			return _.assign({}, state, {
				books: _.map(state.books, b => {
					if (b.id !== action.book.id) return b;
					return _.assign({}, b, { updating: true })
				})
			})

		case BOOK_CHANGE_RESPONSE:
			return _.assign({}, state, {
				books: _.map(state.books, b => {
					if (b.id !== action.book.id) return b;
					return _.assign({}, b, action.ok ? action.book : null, { updating: false })
				})
			})

		case BOOK_DELETE_REQUEST:
			return _.assign({}, state, {
				books: _.map(state.books, b => {
					if (b.id !== action.book.id) return b;
					return _.assign({}, b, { updating: true })
				})
			})

		case BOOK_DELETE_RESPONSE:
			if (!action.ok) {
				return _.assign({}, state, {
					books: _.map(state.books, b => {
						if (b.id !== action.book.id) return b;
						return _.assign({}, b, { updating: false })
					})
				})
			}

			return _.assign({}, state, {
				books: _.filter(state.books, b => b.id !== action.book.id)
			})

		case BOOK_SET_FILTER:
			return _.assign({}, state, {
				bookFilter: {
					...state.filter,
					[action.filter]: action.value,
				}
			});

		default:
			return state;
	}
}

export default webbooks
