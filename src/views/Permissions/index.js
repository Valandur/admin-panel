import React, { Component } from "react"
import { connect } from "react-redux"
import { Label, Tab, Menu, Segment, Icon, Table } from "semantic-ui-react"
import { translate } from "react-i18next"
import _ from "lodash"

import { requestList } from "../../actions/dataview"
import DataViewFunc from "../../components/DataView"


class Permissions extends Component {

	constructor(props) {
		super(props);

		this.onTabChange = this.onTabChange.bind(this)
	}

	componentDidMount() {
		this.props.requestCollections();
	}

	onTabChange(event, data) {
		const coll = this.props.collections[data.activeIndex]
		this.props.requestSubjects(coll.id)
	}

	render() {
		const _t = this.props.t

		return <Segment basic>
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
						const DataView = DataViewFunc("permission/collection/" + coll.id + "/subject", "id")
						return <Segment basic>
							<DataView
								static
								fields={{
									id: _t("Id"),
									friendlyId: _t("Name"),
									permissions: {
										label: _t("Permissions"),
										view: (subject) =>
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
																	name={value ? "check" : "times"}
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
	}
}

const mapStateToProps = (state) => {
	const colls = state["permission.collection"];
	if (!colls) return { collections: [] };

	return {
		collections: colls.list.map(coll => {
			const subjs = state["permission.collection." + coll.id + ".subject"]
			return _.assign({}, coll, {
				subjects: subjs ? subjs.list : []
			})
		}),
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestCollections: () => dispatch(requestList("permission/collection", false)),
		requestSubjects: (id) => dispatch(requestList("permission/collection/" + id + "/subject", true)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(translate("Permissions")(Permissions));
