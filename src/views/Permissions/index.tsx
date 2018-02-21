import * as _ from "lodash"
import * as React from "react"
import { translate } from "react-i18next"
import { connect, Dispatch } from "react-redux"
import { Icon, Label, Menu, Segment, Tab, Table, TabProps } from "semantic-ui-react"

import DataTable from "../../components/DataTable"

import { AppAction } from "../../actions"
import { CollectionsListRequestAction, requestCollections, requestSubjects,
	SubjectsListRequestAction } from "../../actions/permission"
import { Subject, SubjectCollection } from "../../fetch"
import { AppState } from "../../types"

interface Props extends reactI18Next.InjectedTranslateProps {
	collections: SubjectCollection[]
	subjects: Subject[]
	requestCollections: () => CollectionsListRequestAction
	requestSubjects: (coll: SubjectCollection) => SubjectsListRequestAction
}

interface OwnState {
}

class Permissions extends React.Component<Props, OwnState> {

	constructor(props: Props) {
		super(props)

		this.onTabChange = this.onTabChange.bind(this)
	}

	componentDidMount() {
		this.props.requestCollections()
	}

	onTabChange(event: React.MouseEvent<HTMLDivElement>, data: TabProps) {
		if (!data.activeIndex && data.activeIndex !== 0) {
			return
		}

		const coll = this.props.collections[data.activeIndex]
		this.props.requestSubjects(coll.id)
	}

	render() {
		const _t = this.props.t

		return (
			<Segment basic>
				<Tab
					defaultActiveIndex={-1}
					onTabChange={this.onTabChange}
					menu={{secondary: true, pointing: true}}
					panes={_.map(this.props.collections, coll => ({
						menuItem:
							<Menu.Item key={coll.id}>
								{_.upperFirst(coll.id)}<Label>{coll.loadedSubjectCount}</Label>
							</Menu.Item>,
						render: () => {
							return <Segment basic>
								<DataTable
									list={this.props.subjects}
									idFunc={(subj: Subject) => subj.id}
									isEditing={(subj: Subject) => false}
									fields={{
										id: _t("Id"),
										friendlyId: _t("Name"),
										permissions: {
											name: "permissions",
											label: _t("Permissions"),
											view: (subject: Subject) =>
												<Table basic compact>
													<Table.Body>
														{_.map(subject.permissions, (value, key) =>
															<Table.Row>
																<Table.Cell>
																	{key}
																</Table.Cell>
																<Table.Cell>
																	<Icon
																		color={value ? "green" : "red"}
																		name={value ? "check" : "delete"}
																	/>
																</Table.Cell>
															</Table.Row>
														)}
													</Table.Body>
												</Table>
										}
									}}
								/>
							</Segment>
						}
					}))}
				/>
			</Segment>
		)
	}
}

const mapStateToProps = (state: AppState) => {
	return {
		collections: state.permission.collections,
		subjects: state.permission.subjects,
	}
}

const mapDispatchToProps = (dispatch: Dispatch<AppAction>) => {
	return {
		requestCollections: () => dispatch(requestCollections()),
		requestSubjects: (coll: SubjectCollection) => dispatch(requestSubjects(coll)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Permissions")(Permissions))
