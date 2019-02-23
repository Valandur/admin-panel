import * as _ from 'lodash';
import * as React from 'react';
import { Trans, withTranslation, WithTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import {
	Button,
	Icon,
	Input,
	Label,
	Menu,
	Modal,
	Segment,
	Tab,
	Table,
	TabProps
} from 'semantic-ui-react';

import { AppAction } from '../../actions';
import {
	CollectionsListRequestAction,
	requestCollections,
	requestSubjects,
	SubjectsListRequestAction
} from '../../actions/permission';
import DataTable, { DataTableFields } from '../../components/DataTable';
import { Subject, SubjectCollection } from '../../fetch';
import { AppState } from '../../types';

interface Props extends WithTranslation {
	collections: SubjectCollection[];
	subjects: Subject[];
	requestCollections: () => CollectionsListRequestAction;
	requestSubjects: (coll: SubjectCollection) => SubjectsListRequestAction;
}

interface OwnState {
	modal: boolean;
	filter: string;
	subject?: Subject;
}

class Permissions extends React.Component<Props, OwnState> {
	public constructor(props: Props) {
		super(props);

		this.state = {
			modal: false,
			filter: ''
		};

		this.onTabChange = this.onTabChange.bind(this);
	}

	public componentDidMount() {
		this.props.requestCollections();
	}

	private onTabChange(event: React.MouseEvent<HTMLDivElement>, data: TabProps) {
		if (!data.activeIndex && data.activeIndex !== 0) {
			return;
		}

		const coll: SubjectCollection = this.props.collections[data.activeIndex];
		this.props.requestSubjects(coll);
	}

	private showSubject = (subject: Subject) => {
		this.setState({
			modal: true,
			subject
		});
	};

	private toggleModal = () => {
		this.setState({
			modal: !this.state.modal
		});
	};

	public render() {
		const { t } = this.props;
		const { subject } = this.state;

		const panes = this.props.collections.map(coll => ({
			menuItem: (
				<Menu.Item key={coll.id}>
					{_.upperFirst(coll.id)}
					<Label>{coll.loadedSubjectCount}</Label>
				</Menu.Item>
			),
			render: () => {
				const fields: DataTableFields<Subject> = {
					id: {
						name: 'id',
						label: t('Id'),
						view: true
					},
					friendlyId: {
						name: 'friendlyId',
						label: t('Name'),
						view: true
					},
					permissions: {
						name: 'permissions',
						label: t('Permissions'),
						view: (subj: Subject) => {
							if (!subj.permissions || !Object.keys(subj.permissions).length) {
								return t('No permissions');
							}

							const onShowSubject = () => this.showSubject(subj);
							return <Button primary content="View" onClick={onShowSubject} />;
						}
					}
				};

				const idFunc = (subj: Subject) => subj.id;
				const idFalse = () => false;

				return (
					<Segment basic>
						<DataTable
							list={this.props.subjects}
							idFunc={idFunc}
							isEditing={idFalse}
							canEdit={idFalse}
							canDelete={idFalse}
							fields={fields}
						/>
					</Segment>
				);
			}
		}));

		return (
			<Segment basic>
				<Tab
					defaultActiveIndex={-1}
					onTabChange={this.onTabChange}
					menu={{ secondary: true, pointing: true }}
					panes={panes}
				/>

				{this.renderSubject(subject)}
			</Segment>
		);
	}

	private renderSubject(subject: Subject | undefined) {
		if (!subject || !subject.permissions) {
			return null;
		}

		const { t } = this.props;

		const onChange = (e: any, props: any) =>
			this.setState({ filter: props.value });

		const perms = Object.keys(subject.permissions)
			.filter(key => key.indexOf(this.state.filter) >= 0)
			.map(key => (
				<Table.Row key={key}>
					<Table.Cell>{key}</Table.Cell>
					<Table.Cell>
						<Icon
							color={(subject.permissions as any)[key] ? 'green' : 'red'}
							name={(subject.permissions as any)[key] ? 'check' : 'delete'}
						/>
					</Table.Cell>
				</Table.Row>
			));

		return (
			<Modal
				open={this.state.modal}
				onClose={this.toggleModal}
				size="fullscreen"
				className="scrolling"
			>
				<Modal.Header>
					<Trans i18nKey="GameRulesTitle">Permissions for '{subject.id}'</Trans>
				</Modal.Header>
				<Modal.Content>
					<Input
						type="text"
						placeholder="Filter..."
						value={this.state.filter}
						onChange={onChange}
					/>
					<Table basic compact>
						<Table.Body>{perms}</Table.Body>
					</Table>
				</Modal.Content>
				<Modal.Actions>
					<Button primary onClick={this.toggleModal}>
						{t('OK')}
					</Button>
				</Modal.Actions>
			</Modal>
		);
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		collections: state.permission.collections,
		subjects: state.permission.subjects
	};
};

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCollections: () => dispatch(requestCollections()),
		requestSubjects: (coll: SubjectCollection) =>
			dispatch(requestSubjects(coll))
	};
};

export default connect(
	mapStateToProps,
	mapDispatchToProps
)(withTranslation('Permissions')(Permissions));
