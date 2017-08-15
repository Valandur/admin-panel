import React, { Component } from 'react'
import { connect } from "react-redux"
import { Segment, Header, Table, Button, Input, Icon } from "semantic-ui-react"
import _ from "lodash"

import { editProperty, setProperty, requestSaveProperty, requestProperties } from "../../actions/settings"

class Settings extends Component {
	constructor(props) {
		super(props)

		this.handleEdit = this.handleEdit.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	componentDidMount() {
		this.props.requestProperties();
	}

	handleEdit(prop) {
		this.props.editProperty(prop);
	}

	handleChange(event, prop) {
		this.props.setProperty(prop, event.target.value);
	}

	handleSave(prop) {
		this.props.requestSaveProperty(prop);
	}

  render() {
    return (
      <Segment basic>

  			<Header>
  				<Icon name="cogs" fitted /> Properties
  			</Header>

				<Table striped={true}>
					<thead>
						<tr>
							<th>Name</th>
							<th>Value</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{_.map(this.props.properties, (prop) =>
							<tr key={prop.key}>
								<td>{prop.key}</td>
								<td>
									{ prop.edit ?
										<Input type="text" value={prop.value} disabled={prop.saving}
											onChange={e => this.handleChange(e, prop)}
										/>
									:
										prop.value
									}
								</td>
								<td>
									{ prop.edit ? [
										<Button key={1} color="green" 
											disabled={prop.saving} onClick={e => this.handleSave(prop)}>
											<Icon name="save" /> Save
										</Button>,
										" ",
										<Button key={2} color="yellow"
											disabled={prop.saving} onClick={e => this.handleEdit(prop)}
										>
											Cancel
										</Button>
									] :
									<Button color="blue" 
										onClick={e => this.handleEdit(prop)}
									>
										<Icon name="edit" /> Edit
									</Button>
									}
									{" "}
									{ prop.saving ?
										<Icon name="spinner" loading />
									: null}
								</td>
							</tr>
						)}
					</tbody>
				</Table>

      </Segment>
    )
  }
}

const mapStateToProps = (_state) => {
	const state = _state.settings

	return {
		properties: state.properties,
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		requestProperties: () => dispatch(requestProperties()),
		editProperty: (prop) => dispatch(editProperty(prop)),
		setProperty: (prop, value) => dispatch(setProperty(prop, value)),
		requestSaveProperty: (prop) => dispatch(requestSaveProperty(prop)),
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Settings);
