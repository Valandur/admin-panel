import * as _ from "lodash"
import * as React from "react"
import { Trans, translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import {
	Button,
	Icon,
	Label,
	Menu,
	Modal,
	Segment,
	Tab,
	Table,
	TabProps
} from "semantic-ui-react"

import DataTable from "../../components/DataTable"

import { AppAction } from "../../actions"
import {
	CollectionsListRequestAction,
	requestCollections,
	requestSubjects,
	SubjectsListRequestAction
} from "../../actions/permission"
import { Subject, SubjectCollection } from "../../fetch"
import { AppState } from "../../types"

interface Props extends reactI18Next.InjectedTranslateProps {
	collections: SubjectCollection[]
	subjects: Subject[]
	requestCollections: () => CollectionsListRequestAction
	requestSubjects: (coll: SubjectCollection) => SubjectsListRequestAction
}

interface OwnState {
	modal: boolean
	subject?: Subject
}

class Permissions extends React.Component<Props, OwnState> {
	constructor(props: Props) {
		super(props)

		this.state = {
			modal: false
		}

		this.onTabChange = this.onTabChange.bind(this)
	}

	componentDidMount() {
		this.props.requestCollections()
	}

	onTabChange(event: React.MouseEvent<HTMLDivElement>, data: TabProps) {
		if (!data.activeIndex && data.activeIndex !== 0) {
			return
		}

		const coll: SubjectCollection = this.props.collections[data.activeIndex]
		this.props.requestSubjects(coll)
	}

	showSubject(subject: Subject) {
		this.setState({
			modal: true,
			subject
		})
	}

	toggleModal() {
		this.setState({
			modal: !this.state.modal
		})
	}

	render() {
		const _t = this.props.t
		const { modal, subject } = this.state

		return (
			<Segment basic>
				<Tab
					defaultActiveIndex={-1}
					onTabChange={this.onTabChange}
					menu={{ secondary: true, pointing: true }}
					panes={this.props.collections.map(coll => ({
						menuItem: (
							<Menu.Item key={coll.id}>
								{_.upperFirst(coll.id)}
								<Label>{coll.loadedSubjectCount}</Label>
							</Menu.Item>
						),
						render: () => {
							return (
								<Segment basic>
									<DataTable
										list={this.props.subjects}
										idFunc={(subj: Subject) => subj.id}
										isEditing={(subj: Subject) => false}
										fields={{
											id: {
												name: "id",
												label: _t("Id"),
												view: true
											},
											friendlyId: {
												name: "friendlyId",
												label: _t("Name"),
												view: true
											},
											permissions: {
												name: "permissions",
												label: _t("Permissions"),
												view: (subj: Subject) => {
													if (
														!subj.permissions ||
														!Object.keys(subj.permissions).length
													) {
														return _t("No permissions")
													}

													return (
														<Button
															primary
															content="View"
															onClick={() => this.showSubject(subj)}
														/>
													)
												}
											}
										}}
									/>
								</Segment>
							)
						}
					}))}
				/>

				{subject &&
					subject.permissions && (
						<Modal open={modal} onClose={() => this.toggleModal()}>
							<Modal.Header>
								<Trans i18nKey="GameRulesTitle">
									Permissions for '{subject.id}'
								</Trans>
							</Modal.Header>
							<Modal.Content>
								<Table basic compact>
									<Table.Body>
										{Object.keys(subject.permissions).map(key => (
											<Table.Row key={key}>
												<Table.Cell>{key}</Table.Cell>
												<Table.Cell>
													<Icon
														color={
															(subject.permissions as any)[key]
																? "green"
																: "red"
														}
														name={
															(subject.permissions as any)[key]
																? "check"
																: "delete"
														}
													/>
												</Table.Cell>
											</Table.Row>
										))}
									</Table.Body>
								</Table>
							</Modal.Content>
							<Modal.Actions>
								<Button color="blue" onClick={() => this.toggleModal()}>
									{_t("OK")}
								</Button>
							</Modal.Actions>
						</Modal>
					)}
			</Segment>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		collections: state.permission.collections,
		subjects: state.permission.subjects
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCollections: () => dispatch(requestCollections()),
		requestSubjects: (coll: SubjectCollection) =>
			dispatch(requestSubjects(coll))
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(
	translate("Permissions")(Permissions)
)
