import React, { Component } from "react"
import { connect } from "react-redux"
import { Segment, Header, Table, Accordion, List } from "semantic-ui-react"
import _ from "lodash"

import { requestKits } from "../../../actions/nucleus"

class Kits extends Component {

	componentDidMount() {
		this.props.requestKits()
	}

  render() {
    return (
    	<Segment basic>

    		<Header>
    			<i className="fa fa-wrench"> Kits</i>
    		</Header>

    		<Table striped={true}>
					<Table.Header>
						<Table.Row>
							<Table.HeaderCell>Name</Table.HeaderCell>
							<Table.HeaderCell>Cost</Table.HeaderCell>
							<Table.HeaderCell>Interval</Table.HeaderCell>
							<Table.HeaderCell>Commands</Table.HeaderCell>
							<Table.HeaderCell>Stacks</Table.HeaderCell>
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{_.map(this.props.kits, kit =>
							<Table.Row key={kit.name}>
								<Table.Cell>{kit.name}</Table.Cell>
								<Table.Cell>{kit.cost}</Table.Cell>
								<Table.Cell>{kit.interval}</Table.Cell>
								<Table.Cell><Accordion panels={[{
									title: kit.commands.length + " command" + (kit.commands.length !== 1 ? "s" : ""),
									content: <List bulleted>
										{_.map(kit.commands, cmd => <List.Item>
											{cmd}
										</List.Item>)}
									</List>
								}]} /></Table.Cell>
								<Table.Cell><Accordion panels={[{
									title: kit.stacks.length + " stack" + (kit.stacks.length !== 1 ? "s" : ""),
									content: <List bulleted>
										{_.map(kit.stacks, stack => <List.Item>
											{JSON.stringify(stack)}
										</List.Item>)}
									</List>
								}]} /></Table.Cell>
							</Table.Row>
						)}
					</Table.Body>
				</Table>

			</Segment>
		);
  }
}

const mapStateToProps = (_state) => {
	const state = _state.nucleus;

	return {
		kits: state.kits,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestKits: () => dispatch(requestKits(true)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Kits);
