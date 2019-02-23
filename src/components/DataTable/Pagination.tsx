import * as React from 'react';
import { Menu } from 'semantic-ui-react';

export interface Props {
	page: number;
	maxPage: number;
	changePage: (event: React.MouseEvent<HTMLElement>, page: number) => void;
}

export default class Pagination extends React.Component<Props> {
	public shouldComponentUpdate(nextProps: Props, nextState: any) {
		return (
			nextProps.page !== this.props.page ||
			nextProps.maxPage !== this.props.maxPage
		);
	}

	public render() {
		if (this.props.maxPage <= 1) {
			return null;
		}

		return (
			<Menu pagination>
				{this.renderFirst()}
				{this.renderPrevMore()}
				{this.renderMain()}
				{this.renderNextMore()}
				{this.renderLast()}
			</Menu>
		);
	}

	private renderFirst() {
		if (this.props.page <= 4) {
			return null;
		}

		// tslint:disable-next-line:jsx-no-lambda
		return <Menu.Item onClick={e => this.props.changePage(e, 0)}>1</Menu.Item>;
	}

	private renderPrevMore() {
		if (this.props.page <= 5) {
			return null;
		}

		return (
			// tslint:disable-next-line:jsx-no-lambda
			<Menu.Item onClick={e => this.props.changePage(e, this.props.page - 5)}>
				...
			</Menu.Item>
		);
	}

	private renderMain() {
		const { page, maxPage } = this.props;
		const from = Math.max(0, page - 4);
		const to = Math.min(maxPage, page + 5);

		const pages = [];
		for (let i = from; i < to; i++) {
			pages.push(i);
		}

		return pages.map(p => (
			<Menu.Item
				key={p}
				// tslint:disable-next-line:jsx-no-lambda
				onClick={e => this.props.changePage(e, p)}
				active={p === page}
			>
				{p + 1}
			</Menu.Item>
		));
	}

	private renderNextMore() {
		if (this.props.page >= this.props.maxPage - 6) {
			return null;
		}

		return (
			// tslint:disable-next-line:jsx-no-lambda
			<Menu.Item onClick={e => this.props.changePage(e, this.props.page + 5)}>
				...
			</Menu.Item>
		);
	}

	private renderLast() {
		if (this.props.page >= this.props.maxPage - 5) {
			return null;
		}

		return (
			<Menu.Item
				// tslint:disable-next-line:jsx-no-lambda
				onClick={e => this.props.changePage(e, this.props.maxPage - 1)}
			>
				{this.props.maxPage}
			</Menu.Item>
		);
	}
}
