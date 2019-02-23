import * as copy from 'copy-to-clipboard';
import * as React from 'react';
import { withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { Button, Input, List } from 'semantic-ui-react';

import { AppAction } from '../../../actions';
import DataViewFunc, { DataViewFields } from '../../../components/DataView';
import { WebBooksBook } from '../../../fetch';
import { AppState, DataViewRef } from '../../../types';

// tslint:disable-next-line: variable-name
const DataView = DataViewFunc('web-books/book', 'id');

interface Props extends WithTranslation {
	apiUrl: string;
}

interface OwnState {
	lines: string[];
	newItem: '';
}

class Books extends React.Component<Props, OwnState> {
	public constructor(props: Props) {
		super(props);

		this.renderEditContent = this.renderEditContent.bind(this);
	}

	public render() {
		const { t } = this.props;

		const linkView = (book: WebBooksBook) => {
			const action = {
				color: 'teal',
				icon: 'linkify',
				onClick: () => this.copy(book)
			};
			const value =
				this.props.apiUrl + '/api/v5/web-books/book/' + book.id + '/html';
			return (
				<Input fluid onFocus={this.onFocus} action={action} value={value} />
			);
		};

		const fields: DataViewFields<WebBooksBook> = {
			id: {
				label: t('Id'),
				create: true,
				filter: true,
				required: true
			},
			title: {
				label: t('Title'),
				edit: true,
				create: true,
				required: true,
				wide: true
			},
			lines: {
				view: false,
				edit: true
			},
			content: {
				label: t('Content'),
				wide: true,
				view: book => <div dangerouslySetInnerHTML={{ __html: book.html }} />,
				edit: this.renderEditContent
			},
			link: {
				label: t('Link'),
				wide: true,
				view: linkView
			}
		};

		const onSave = (
			obj: WebBooksBook,
			newData: any,
			view: DataViewRef<WebBooksBook>
		) => {
			view.save(obj, {
				id: obj.id,
				title: newData.title,
				lines: newData.lines
			});
		};

		return (
			<DataView
				canEdit
				canDelete
				icon="book"
				title={t('WebBooks')}
				filterTitle={t('FilterBooks')}
				createTitle={t('CreateBook')}
				fields={fields}
				onSave={onSave}
			/>
		);
	}

	private renderEditContent(
		book: WebBooksBook,
		view: DataViewRef<WebBooksBook>
	) {
		const { t } = this.props;

		const lines = view.state.lines.map((line: string, index: number) => {
			const onDel = () => this.deleteLine(view, index);
			const onMoveDown = () => this.moveLineDown(view, index);
			const onMoveLineUp = () => this.moveLineUp(view, index);
			return (
				<List.Item key={index}>
					<Button compact negative icon="delete" size="mini" onClick={onDel} />
					{line}
					<Button
						compact
						primary
						icon="arrow down"
						size="mini"
						floated="right"
						onClick={onMoveDown}
						disabled={index >= view.state.lines.length - 1}
					/>
					<Button
						compact
						primary
						icon="arrow up"
						size="mini"
						floated="right"
						onClick={onMoveLineUp}
						disabled={index <= 0}
					/>
				</List.Item>
			);
		});

		const action = {
			color: 'green',
			icon: 'plus',
			onClick: () => this.addLine(view)
		};

		return (
			<>
				<List size="large">{lines}</List>
				<Input
					name="newItem"
					placeholder={t('NewLine')}
					onChange={view.handleChange}
					value={view.state.newItem ? view.state.newItem : ''}
					action={action}
				/>
			</>
		);
	}

	private onFocus = (e: React.SyntheticEvent<HTMLInputElement>) => {
		(e.target as any).select();
	};

	private addLine(view: DataViewRef<WebBooksBook>) {
		view.setState({
			lines: view.state.lines.concat(view.state.newItem),
			newItem: ''
		});
	}

	private moveLineUp(view: DataViewRef<WebBooksBook>, index: number) {
		view.setState({
			lines: view.state.lines.map((line: string, i: number) =>
				i === index
					? view.state.lines[index - 1]
					: i === index - 1
					? view.state.lines[index]
					: line
			)
		});
	}

	private moveLineDown(view: DataViewRef<WebBooksBook>, index: number) {
		view.setState({
			lines: view.state.lines.map((line: string, i: number) =>
				i === index
					? view.state.lines[index + 1]
					: i === index + 1
					? view.state.lines[index]
					: line
			)
		});
	}

	private deleteLine(view: DataViewRef<WebBooksBook>, index: number) {
		view.setState({
			lines: view.state.lines.filter((line: string, i: number) => i !== index),
			newItem: ''
		});
	}

	private copy(book: WebBooksBook) {
		copy(this.props.apiUrl + '/api/v5/web-books/book/' + book.id + '/html');
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		apiUrl: state.api.server.apiUrl
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Integrations.WebBooks')(Books));
