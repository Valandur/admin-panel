import * as React from "react"
import { Menu } from "semantic-ui-react"

export interface Props {
	page: number
	maxPage: number
	changePage: (event: React.MouseEvent<HTMLElement>, page: number) => void
}

export default class Pagination extends React.Component<Props> {

	shouldComponentUpdate(nextProps: Props, nextState: any) {
		return nextProps.page !== this.props.page ||
			nextProps.maxPage !== this.props.maxPage
	}

	render() {
		if (this.props.maxPage <= 1) {
			return null
		}

		const { page, maxPage } = this.props
		const from = Math.max(0, page - 4)
		const to = Math.min(maxPage, page + 5)
		const pages = []
		for (let i = from; i < to; i++) {
			pages.push(i)
		}

		return (
			<Menu pagination>
				{ page > 4 ?
					<Menu.Item onClick={e => this.props.changePage(e, 0)}>
						1
					</Menu.Item>
				: null }
				{ page > 5 ?
					<Menu.Item onClick={e => this.props.changePage(e, page - 5)}>
						...
					</Menu.Item>
				: null }
				{ pages.map(p => (
					<Menu.Item key={p} onClick={e => this.props.changePage(e, p)} active={p === page}>
						{p + 1}
					</Menu.Item>
				))}
				{ page < maxPage - 6 ?
					<Menu.Item onClick={e => this.props.changePage(e, page + 5)}>
						...
					</Menu.Item>
				: null }
				{ page < maxPage - 5 ?
					<Menu.Item onClick={e => this.props.changePage(e, maxPage - 1)}>
						{maxPage}
					</Menu.Item>
				: null }
			</Menu>
		)
	}
}
