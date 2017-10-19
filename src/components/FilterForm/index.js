import React, { Component } from "react"
import {
	Segment, Header, Form, Icon, Dropdown, Message
} from "semantic-ui-react"
import _ from "lodash"


class FilterForm extends Component {

	constructor(props) {
		super(props);

		this.filterChange = this.filterChange.bind(this)
	}

	filterChange(event, data) {
		const name = data.name ? data.name : data.id;
		this.props.onFilterChange(name, data.value);
	}

	render() {
		const { title, filters, values, valid } = this.props;

		const filterGroups = [];
		_.each(filters, (filter, name) => {
			const newFilter = {
				name: name,
			};
			if (typeof filter === "string") {
				newFilter.label = filter;
			} else {
				_.assign(newFilter, filter);
			}

			if (filterGroups.length && !filterGroups[filterGroups.length - 1].second) {
				filterGroups[filterGroups.length - 1].second = newFilter;
			} else {
				filterGroups.push({ first: newFilter })
			}
		})

		return <Segment>
			<Header>
				<Icon name="filter" fitted /> {title}
			</Header>

			<Form>
			{_.map(filterGroups, (filterGroup, i) =>
				<Form.Group key={i} widths="equal">
					{filterGroup.first &&
						this.renderFilter(filterGroup.first, values[filterGroup.first.name], !valid)
					}

					{filterGroup.second &&
						this.renderFilter(filterGroup.second, values[filterGroup.second.name], !valid)
					}
				</Form.Group>
			)}
				<Message
					error
					visible={!valid}
					content="Search term must be a valid regex"
				/>
			</Form>
		</Segment>
	}

	renderFilter(filter, value, error) {
		if (filter.options) {
			return <Form.Field
				fluid selection search multiple
				control={Dropdown}
				name={filter.name}
				label={filter.label}
				placeholder={filter.label}
				options={filter.options}
				value={value}
				error={error}
				onChange={this.filterChange}
			/>
		}

		return <Form.Input
			name={filter.name}
			label={filter.label}
			placeholder={filter.label}
			value={value}
			error={error}
			onChange={this.filterChange}
		/>
	}
}

export default FilterForm
